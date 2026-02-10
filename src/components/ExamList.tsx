// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Exam {
//   id: number;
//   title: string;
//   window_start: string;
//   window_end: string;
//   duration_minutes: number;
// }

// const ExamList: React.FC = () => {
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [startingExamId, setStartingExamId] = useState<number | null>(null);
//   const token = localStorage.getItem("userToken");
//   const collegeName = localStorage.getItem("userCollege");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const res = await axios.get("https://api.devtalent.securxperts.com:8000/exam/exams", {
//           params: { college_name: collegeName },
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setExams(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch exams");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExams();     
//   }, []);

//   const startExam = async (examId: number) => {
//     setStartingExamId(examId);
//     try {
//       const res = await axios.post(
//         "https://api.devtalent.securxperts.com:8000/exam/exams/start/auto",
//         { exam_id: examId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const attemptId = res.data.attempt_id || res.data.id;
//       if (!attemptId) throw new Error("Invalid attemptId");

//       // Redirect to MCQ Paper screen with attemptId
//       navigate(`/mcqpaper/${attemptId}`);
//     } catch (err: any) {
//       alert(err.response?.data?.detail || err.message);
//     } finally {
//       setStartingExamId(null);
//     }
//   };

//   if (loading) return <div>Loading exams...</div>;

//   return (
//     <div>
//       <h1>Exams</h1>
//       {exams.map((exam) => (
//         <div key={exam.id}>
//           <h2>{exam.title}</h2>
//           <p>Duration: {exam.duration_minutes} mins</p>
//           <button onClick={() => startExam(exam.id)} disabled={startingExamId === exam.id}>
//             {startingExamId === exam.id ? "Starting..." : "Start Exam"}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ExamList;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Exam {
  id: number;
  title: string;
  window_start: string;
  window_end: string;
  duration_minutes: number;
}

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState<number | null>(null);
  const token = localStorage.getItem("userToken");
  const collegeName = localStorage.getItem("userCollege");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("https://api.devtalent.securxperts.com:8000/exam/exams", {
          params: { college_name: collegeName },
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const startExam = async (examId: number) => {
    setStartingExamId(examId);
    try {
      const res = await axios.post(
        "https://api.devtalent.securxperts.com:8000/exam/exams/start/auto",
        { exam_id: examId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const attemptId = res.data.attempt_id || res.data.id;
      if (!attemptId) throw new Error("Invalid attemptId");

      // Redirect to MCQ Paper screen with attemptId
      navigate(`/mcqpaper/${attemptId}`);
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message);
    } finally {
      setStartingExamId(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600">Loading exams...</p>
      </div>
    );

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
  };

  return (
   <div className="min-h-screen  py-20 px-6 flex flex-col items-center">
  <h1 className="text-3xl font-extrabold mb-12">MCQ'S</h1>

  <div className="grid grid-cols-1 gap-10 w-full max-w-md">
    {exams.map((exam) => (
      <div
        key={exam.id}
        className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Top Accent */}
        <div className="h-3 bg-indigo-700 rounded-t-3xl" />

        <div className="p-8">
          {/* Title + Badge */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 leading-snug">
              {exam.title}
            </h2>

            <span className="bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-full">
              {exam.duration_minutes} Mins
            </span>
          </div>

          {/* Start Time */}
          <div className="flex items-center gap-3 text-gray-600 text-base mb-4">
            <Calendar className="w-5 h-5 text-indigo-700" />
            <span>
              Start: {formatDateTime(exam.window_start)}
            </span>
          </div>

          {/* Duration & Marks */}
          <div className="flex items-start gap-3 text-gray-600 text-base">
            <Clock className="w-5 h-5 text-indigo-700 mt-1" />
            <span>
              Duration {exam.duration_minutes} mins
              <br />
              1 Question. 10 marks
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => startExam(exam.id)}
            disabled={startingExamId === exam.id}
            className={`mt-10 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-lg transition-all ${
              startingExamId === exam.id
                ? "bg-indigo-900 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-900 hover:opacity-95"
            }`}
          >
            {startingExamId === exam.id ? "Starting..." : "Start Exam Now"}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default ExamList;
