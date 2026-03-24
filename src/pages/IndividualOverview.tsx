import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";

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

export default function IndividualOverview() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExamIds, setSubmittedExamIds] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  const collageName = localStorage.getItem("userCollege");

  // 🔹 MOCK DATA (instead of API)
  const mockExams: Exam[] = [
    {
      id: 1,
      title: "Technical Round 1",
      description: "Coding test",
      collage: "IMT",
      window_start: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      window_end: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      duration: 30,
      category: "Technical",
      questions: { q1: {}, q2: {}, q3: {} },
    },
    {
      id: 2,
      title: "Technical Round 2",
      description: "Advanced coding",
      collage: "IMT",
      window_start: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      window_end: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      duration: 45,
      category: "Technical",
      questions: { q1: {}, q2: {}, q3: {}, q4: {} },
    },
    {
      id: 3,
      title: "MCQ Round",
      description: "Theory test",
      collage: "IMT",
      window_start: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      window_end: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      duration: 20,
      category: "MCQ",
      questions: { q1: {}, q2: {} },
    },
  ];

  useEffect(() => {
    // 🔹 No API, directly set mock data
    setTimeout(() => {
      setExams(mockExams);

      // Example: mark exam 3 as submitted
      setSubmittedExamIds(new Set([3]));

      setLoading(false);
    }, 500);
  }, []);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleStartExam = async (examId: number) => {
    console.log("Starting exam with ID:", examId);
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
    <div className="min-h-screen bg-white py-12 px-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/individualterms")}
        className="absolute top-6 left-4 z-10 hover:opacity-80"
        style={{
          width: "174.625px",
          height: "36px",
          borderRadius: "10px",
          color: "black",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2" style={{ color: "#6F24A6" }}>
            Welcome to Exam Portal
          </h1>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            College: {collageName || "IMT college, Hyderabad"}
          </p>
        </div>

        <div className="text-start mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Coding Questions
          </h1>
        </div>

        {/* Exams */}
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
                  className="bg-white rounded-2xl shadow-xl border-t-4"
                  style={{ borderTopColor: "#dbdbdcff" }}
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-2 mb-6">
                      <h4 className="text-xl font-bold text-gray-900">
                        {exam.title}
                      </h4>
                      <Badge
                        className="rounded-full px-3 py-1 text-sm font-medium w-fit"
                        style={{
                          background:
                            "linear-gradient(180deg, #6E25B3 0%, #6D28D9 100%)",
                          color: "white",
                        }}
                      >
                        {exam.duration} Mins
                      </Badge>
                    </div>

                    <div className="space-y-3 text-gray-700 text-sm mb-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4" color="#7C3AED" />
                        <span>Start: {formatDateTime(exam.window_start)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" color="#7C3AED" />
                        <span>Duration: {exam.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4" color="#7C3AED" />
                        <span>
                          {Object.keys(exam.questions || {}).length} Questions:{" "}
                          {Object.keys(exam.questions || {}).length * 10} marks
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full text-base font-semibold text-white rounded-lg py-3"
                      style={{
                        background:
                          "linear-gradient(180deg, #6E24A5 0%, #6D28D9 100%)",
                        cursor: "pointer",
                      }}
                    >
                      Start Exam Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
