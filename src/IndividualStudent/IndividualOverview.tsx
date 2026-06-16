import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/pages/Services/api/api";

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
  question_count: number;
  total_marks: number;
}

export default function IndividualOverview() {
  const navigate = useNavigate();
  const { courseId: routeCourseId } = useParams<{ courseId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const queryCourseId = searchParams.get("courseId");
  const stateCourseId = (location.state as any)?.courseId;
  const localCourseId = localStorage.getItem("selectedCourseId");

  // Layered courseId resolution
  const [courseId, setCourseId] = useState(routeCourseId || queryCourseId || stateCourseId || localCourseId || "1");

  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  // Keep stored in localStorage for subsequent requests/pages
  useEffect(() => {
    if (courseId) {
      localStorage.setItem("selectedCourseId", courseId);
    }
  }, [courseId]);

  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExamIds, setSubmittedExamIds] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  const [collageName, setCollageName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) {
          setCollageName("Guest College");
          return;
        }

        let studentId = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          studentId = String(payload.user_id || payload.id || payload.candidate_id || payload.sub || "");
        } catch (e) {
          console.error("Error decoding token", e);
        }

        if (studentId) {
          const response = await fetch(`${API_BASE_URL}/student/students/${studentId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCollageName(data.college_name || localStorage.getItem("userCollege") || "Unknown College");
          } else {
            setCollageName(localStorage.getItem("userCollege") || "Unknown College");
          }
        } else {
          setCollageName(localStorage.getItem("userCollege") || "Unknown College");
        }
      } catch (error) {
        console.error("Error fetching student college:", error);
        setCollageName(localStorage.getItem("userCollege") || "Unknown College");
      }
    };
    fetchCollege();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          let subs = Array.isArray(data) ? data : (data ? [data] : []);
          setAllSubscriptions(subs);

          if (subs.length > 0) {
            const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
            const targetSubs = activeSubs.length > 0 ? activeSubs : subs;

            targetSubs.sort((a: any, b: any) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime());

            const storedPlanId = localStorage.getItem("selectedPlanId");
            let sub = targetSubs[0];
            if (storedPlanId) {
              const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(storedPlanId));
              if (matched) sub = matched;
            }

            setSubscription(sub);

            // Initialize course selection with the one already in route/storage if valid
            if (sub.selected_courses && sub.selected_courses.length > 0) {
              const currentInSub = sub.selected_courses.find((c: any) => String(c.course_id) === String(courseId));
              if (!currentInSub) {
                setCourseId(String(sub.selected_courses[0].course_id));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("access_token");

      const [mcqRes, codingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/ind/mcq/student/courses/${courseId}/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }).catch((e) => {
          console.error("Failed to fetch MCQ exams:", e);
          return null;
        }),
        fetch(`${API_BASE_URL}/ind/coding/student/courses/${courseId}/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }).catch((e) => {
          console.error("Failed to fetch Coding exams:", e);
          return null;
        }),
      ]);

      let allExamsList: any[] = [];

      // Process MCQ Exams
      if (mcqRes && mcqRes.ok) {
        const data = await mcqRes.json();
        let examsList: any[] = [];
        if (Array.isArray(data)) {
          examsList = data;
        } else if (data && Array.isArray(data.mcq_exams)) {
          examsList = data.mcq_exams;
        } else if (data) {
          examsList = [data];
        }
        allExamsList = [...allExamsList, ...examsList.map(e => ({ ...e, exam_category: "MCQ" }))];
      }

      // Process Coding Exams
      if (codingRes && codingRes.ok) {
        const data = await codingRes.json();
        let examsList: any[] = [];
        if (Array.isArray(data)) {
          examsList = data;
        } else if (data && Array.isArray(data.coding_exams)) {
          examsList = data.coding_exams;
        } else if (data && Array.isArray(data.exams)) {
          examsList = data.exams;
        } else if (data) {
          examsList = [data];
        }
        allExamsList = [...allExamsList, ...examsList.map(e => ({ ...e, exam_category: "Coding" }))];
      }

      // Map API data to our Exam interface
      const mappedExams: Exam[] = await Promise.all(allExamsList.map(async (item: any) => {
        let questionsData = item.questions || null;
        let qCount = typeof item.question_count === "number" ? item.question_count : 0;
        let totalMarks = item.total_marks || 0;

        // Fetch questions to get correct question count and total marks
        if (!questionsData || Object.keys(questionsData).length === 0) {
          try {
            const pathPrefix = item.exam_category === "MCQ" ? "mcq" : "coding";
            const qRes = await fetch(`${API_BASE_URL}/ind/${pathPrefix}/student/exams/${item.id || item.exam_id}/questions?limit=500`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`,
              },
            });
            if (qRes.ok) {
              const qData = await qRes.json();
              if (Array.isArray(qData)) {
                questionsData = qData;
              } else if (qData && Array.isArray(qData.questions)) {
                questionsData = qData.questions;
              } else if (qData && typeof qData === 'object') {
                questionsData = qData;
              }
            }
          } catch (e) {
            console.error("Failed to fetch questions for exam", item.id || item.exam_id, e);
          }
        }

        const actualQuestionsCount = questionsData ? (Array.isArray(questionsData) ? questionsData.length : Object.keys(questionsData).length) : 0;
        qCount = actualQuestionsCount > 0 ? actualQuestionsCount : qCount;

        let calculatedMarks = 0;
        if (questionsData) {
          const questionValues = Array.isArray(questionsData) ? questionsData : Object.values(questionsData);
          calculatedMarks = questionValues.reduce((sum: number, q: any) => sum + (Number(q.marks) || Number(q.score) || 10), 0);
        }

        const finalTotalMarks = calculatedMarks > 0 ? calculatedMarks : (totalMarks || (qCount * 10));

        return {
          id: item.id || item.exam_id,
          title: item.title || "Untitled Exam",
          description: item.description || "No description available",
          collage: item.college_name || collageName || "N/A",
          window_start: item.window_start || item.created_at || new Date().toISOString(),
          window_end: item.window_end || new Date(Date.now() + 86400000).toISOString(),
          duration: item.duration_minutes || item.duration || 60,
          category: item.exam_category || "MCQ",
          questions: questionsData || {},
          question_count: qCount,
          total_marks: finalTotalMarks,
        };
      }));

      setExams(mappedExams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [courseId]);

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

  const handleStartExam = async (examId: number, category: string) => {
    console.log("Starting exam with ID:", examId, "category:", category);

    if (category === "Coding" || category === "Coding Only") {
      try {
        const userToken = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        const response = await fetch(`${API_BASE_URL}/ind/coding/student/exams/${examId}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ course_id: parseInt(courseId) || 0 })
        });

        if (response.ok) {
          const data = await response.json();
          const attemptId = data.attempt_id || data.id;
          
          const currentExam = exams.find(e => String(e.id) === String(examId));
          
          navigate("/online-compiler", { 
            state: { 
              examId: examId,
              attemptId: attemptId,
              examData: {
                title: data.exam?.title || currentExam?.title || "Coding Exam",
                duration: data.exam?.duration_minutes || currentExam?.duration || 60,
                questions: data.questions || currentExam?.questions || [],
                examId: examId
              }
            } 
          });
        } else {
          toast.error("Failed to start Coding exam. Please try again.");
        }
      } catch (error) {
        console.error("Error starting Coding exam:", error);
        toast.error("An error occurred while starting the exam.");
      }
    } else {
      // Default to MCQ routing
      try {
        const userToken = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        const response = await fetch(`${API_BASE_URL}/ind/mcq/student/exams/${examId}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ course_id: parseInt(courseId) || 0 })
        });

        if (response.ok) {
          const data = await response.json();
          const attemptId = data.attempt_id || data.id;
          
          // Find the exam to pass title and duration to the paper component
          const currentExam = exams.find(e => String(e.id) === String(examId));
          console.log("Found current exam:", currentExam);
          
          navigate(`/mcqpaper/${attemptId}`, {
            state: {
              examData: {
                title: currentExam?.title || "MCQ Exam",
                duration: currentExam?.duration || 10,
                questions: currentExam?.questions || [],
                examId: examId,
                courseId: parseInt(courseId as string) || 0
              }
            }
          });
        } else {
          toast.error("Failed to start MCQ exam. Please try again.");
        }
      } catch (error) {
        console.error("Error starting MCQ exam:", error);
        toast.error("An error occurred while starting the exam.");
      }
    }
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
        onClick={() => navigate(`/individualterms/${courseId}`)}
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
            College: {collageName}
          </p>
        </div>

        <div className="text-start mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {subscription?.selected_courses?.find((c: any) => String(c.course_id) === String(courseId))?.course_name || "Technical MCQ Exams"}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Course ID: {courseId}
          </p>
        </div>

        {/* Exams */}
        {exams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No active exams found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* MCQ Exams Section */}
            {exams.filter(e => e.category === "MCQ").length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">
                  MCQ Exams
                </h2>
                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                  {exams.filter(e => e.category === "MCQ").map((exam) => {
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
                                {exam.question_count} Questions:{" "}
                                {exam.total_marks} marks
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartExam(exam.id, exam.category)}
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
              </div>
            )}

            {/* Coding Exams Section */}
            {exams.filter(e => e.category === "Coding" || e.category === "Coding Only").length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">
                  Coding Exams
                </h2>
                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                  {exams.filter(e => e.category === "Coding" || e.category === "Coding Only").map((exam) => {
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
                                {exam.question_count} Questions:{" "}
                                {exam.total_marks} marks
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartExam(exam.id, exam.category)}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
