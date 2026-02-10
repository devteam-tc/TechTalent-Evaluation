
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
// import MCQQuestionPaperCard from "@/components/MCQQuestionPaperCard";
import ExamList from "@/components/ExamList";

interface Exam {
  id: number;
  title: string;
  description: string;
  collage: string;
  window_start: string;
  window_end: string;
  duration: number;
  category: string;
  questions: Record<string, any>;
}

export default function Overview() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExamIds, setSubmittedExamIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");
  const collageName = localStorage.getItem("userCollege");

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }
    fetchExams();
    // fetchSubmittedExams();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const url = `https://api.devtalent.securxperts.com:8000/exam/get?collage=${encodeURIComponent(collageName || "")}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exams");

      const data = await response.json();
      if (Array.isArray(data)) {
        setExams(data as Exam[]);
      } else {
        toast.error("Invalid data format");
        setExams([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available exams");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // const fetchSubmittedExams = async () => {
  //   try {
  //     const response = await fetch("https://api.devtalent.securxperts.com:8000/student/exam/attempts", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       console.error("Failed to fetch attempts:", response.status);
  //       return;
  //     }

  //     const attempts = await response.json();

  //     const submittedExamIds = new Set<number>(
  //       attempts
  //         .filter((attempt: any) => attempt.submitted_at !== null && attempt.submitted_at !== undefined)
  //         .map((attempt: any) => Number(attempt.exam_id))
  //     );

  //     setSubmittedExamIds(submittedExamIds);
  //   } catch (err) {
  //     console.error("Error fetching submitted exams:", err);
  //   }
  // };


  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) +
      ", " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const handleStartExam = async (examId: number) => {
    console.log("Starting exam with ID:", examId);
    console.log("Directly navigating to online-compiler (bypassing API)");

    // Direct navigation without API call since no active technical exam is available
    console.log("Navigating to online-compiler with examId:", examId);
    navigate("/online-compiler", { state: { examId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2" style={{ color: "#33329C" }}>
            Welcome to Exam Portal
          </h1>
          <p className="text-lg" style={{ color: "#33329C" }}>
            College: {collageName || "IMT college, Hyderabad"}
          </p>
        </div>

        <div className="text-center mb-12" >

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Coding Questions
          </h1>
        </div>



        {/* Top Row - Two Special Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
          {/* Technical Round */}
          {/* <div className="bg-white rounded-2xl shadow-lg border-t-8" style={{ borderTopColor: "#CA7BD9" }}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Round - 1</h3>
              <div className="space-y-3 text-gray-700 mb-8">
                <p><strong>Start:</strong> 04 Dec 2025, 09:10 AM</p>
                <p><strong>End:</strong> 11 Dec 2025, 09:10 AM</p>
                <p>30 Mins</p>
              </div>
              <Button
                className="w-full text-lg py-6 font-semibold text-white rounded-lg"
                style={{ background: "linear-gradient(to right, #961BAC, #3D0B46)" }}
                onClick={() => handleStartExam(1)} // placeholder
              >
                Start Exam Now
              </Button>
            </div>
          </div> */}

          {/* Non-Technical Round */}

        </div>

        {/* Bottom Row - Regular Exam Cards */}
        {exams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No active exams found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {exams.map((exam) => {
              const now = new Date();
              const windowStart = new Date(exam.window_start);
              const windowEnd = new Date(exam.window_end);
              const isStarted = now >= windowStart;
              const isEnded = now > windowEnd;
              const isSubmitted = submittedExamIds.has(exam.id);

              return (


                <div
                  key={exam.id}
                  className="bg-white rounded-2xl shadow-lg border-t-8"
                  style={{ borderTopColor: "#33329C" }}
                >


                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">{exam.title}</h4>
                      <Badge className="rounded-full px-4 py-1 text-sm" style={{ backgroundColor: "#33329C", color: "white" }}>
                        {exam.duration} Mins
                      </Badge>
                    </div>

                    <div className="space-y-3 text-gray-700 text-sm mb-6">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" style={{ color: "#33329C" }} />
                        Start: {formatDateTime(exam.window_start)}
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-5 h-5 mt-0.5" style={{ color: "#33329C" }} />
                        <span>
                          Duration {exam.duration} mins<br />
                          1 Question. 10 marks
                        </span>
                      </p>
                    </div>

                    <Button
                      onClick={() => handleStartExam(exam.id)}
                      disabled={!isStarted || isEnded || isSubmitted}
                      className="w-full text-lg py-6 font-semibold text-white rounded-lg"
                      style={{
                        background: (isSubmitted || !isStarted || isEnded)
                          ? "#cccccc"
                          : "linear-gradient(to right, #29287D, #3D0B46)",
                        cursor: (!isStarted || isEnded || isSubmitted) ? "not-allowed" : "pointer",
                      }}
                    >
                      {isSubmitted ? "Exam Completed" : (!isStarted ? "Not Started Yet" : isEnded ? "Exam Ended" : "Start Exam Now")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* <MCQQuestionPaperCard /> */}
      <ExamList />
    </div>

  );
}
