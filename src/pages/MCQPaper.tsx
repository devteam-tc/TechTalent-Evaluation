// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// interface Option {
//   id: number;
//   text: string;
// }

// interface Question {
//   id: number;
//   text: string;
//   options: Option[];
// }

// const MCQPaper: React.FC = () => {
//   const { attemptId } = useParams<{ attemptId: string }>();
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [answers, setAnswers] = useState<Record<number, number>>({});
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("userToken");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPaper = async () => {
//       try {
//         const res = await axios.get(
//           `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/paper`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setQuestions(res.data.questions || res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch exam paper");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPaper();
//   }, [attemptId]);

//   const selectOption = (questionId: number, optionId: number) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
//   };

//   const submitExam = async () => {
//     try {
//       const payload = Object.entries(answers).map(([questionId, chosenOptionId]) => ({
//         question_id: Number(questionId),
//         chosen_option_id: chosenOptionId,
//       }));

//       await axios.post(
//         `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
//         { answers: payload },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Exam submitted successfully!");
//       navigate("/"); // Redirect to exam list
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit exam");
//     }
//   };

//   if (loading) return <div>Loading questions...</div>;

//   return (
//     <div>
//       <h1>MCQ Paper</h1>
//       {questions.map((q) => (
//         <div key={q.id}>
//           <h2>{q.text}</h2>
//           {q.options.map((opt) => (
//             <button
//               key={opt.id}
//               onClick={() => selectOption(q.id, opt.id)}
//               style={{
//                 backgroundColor: answers[q.id] === opt.id ? "lightblue" : "white",
//               }}
//             >
//               {opt.text}
//             </button>
//           ))}
//         </div>
//       ))}
//       <button onClick={submitExam}>Submit Exam</button>
//     </div>
//   );
// };

// export default MCQPaper;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Option {
  id: number;
  text: string;
  image_url?: string;
}

interface Question {
  id: number;
  question_id?: number;
  text: string;
  image_url?: string;
  options: Option[];
}

const MCQPaper: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [examTitle, setExamTitle] = useState("Exam");
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch paper
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await axios.get(
          `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/paper`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const paper: Question[] = Array.isArray(res.data)
          ? res.data
          : res.data.questions;
        if (!paper || paper.length === 0) throw new Error("No questions found");

        setQuestions(paper);
        setDuration(res.data.duration_minutes || 10); // fallback duration
        setTimeLeft((res.data.duration_minutes || 10) * 60);
        setExamTitle(res.data.title || "MCQ Exam");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch exam paper");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [attemptId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleAutoSubmit();
    }
  }, [timeLeft]);

  // Camera enforcement
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Camera & microphone are required. Refresh and allow access.");
        navigate("/");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const selectOption = (questionIndex: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    const payload = Object.entries(selectedAnswers).map(
      ([qIdx, chosenOptionId]) => ({
        question_id:
          questions[Number(qIdx)].question_id || questions[Number(qIdx)].id,
        chosen_option_id: chosenOptionId,
      }),
    );

    try {
      await axios.post(
        `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
        { answers: payload },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Exam submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit exam");
    }
  };

  const handleAutoSubmit = async () => {
    alert("Time over! Exam auto-submitted.");
    try {
      await axios.post(
        `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
        { answers: [] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {}
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const q = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#f6f5fb]">
      {/* HEADER */}
      <div className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-wrap gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold">
            TD
          </div>
          <h1 className="text-lg font-semibold">Welcome To Exam Portal</h1>
        </div>

        {/* Center */}
        <div className="text-center hidden lg:block">
          <p className="text-xs text-gray-400">College</p>
          <p className="font-semibold">CBIT ENGINEERING CLG</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400">TIME REMAINING</p>
            <p className="font-semibold">{formatTime(timeLeft)}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">CANDIDATE ID</p>
            <p className="font-semibold">CP-2024-9XBR</p>
          </div>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-16 h-10 md:w-20 md:h-12 rounded-md border object-cover"
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {/* EXAM TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">Final MCQ Exam</h2>
          <p className="text-gray-500 text-sm">Linux operating systems</p>
        </div>

        {/* PROGRESS */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Questions {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>
              {Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100,
              )}
              %
            </span>
          </div>

          <div className="h-2 md:h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <p className="font-semibold mb-3">
            Question {currentQuestionIndex + 1}
          </p>

          <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm mb-4">
            Introduction to linux
          </span>

          <h3 className="text-lg font-semibold mb-6">{q.text}</h3>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              const selected = selectedAnswers[currentQuestionIndex] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(currentQuestionIndex, opt.id)}
                  className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border transition

                  ${selected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}
                `}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-left">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8">
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border text-gray-500 disabled:opacity-50"
            >
              ‹ Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Next ›
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-600 text-white"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQPaper;
