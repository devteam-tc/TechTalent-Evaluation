import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Clock, Play, Code2, FileText, Camera } from "lucide-react";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/theme-textmate"; // Light theme

interface College {
  id: number;
  name: string;
  passkey_expires_at: string;
}

function OnlineCompiler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = location.state || {};
  const token = localStorage.getItem("userToken");

  const [questions, setQuestions] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState("Coding Exam");
  const [userId, setUserId] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [fileName, setFileName] = useState("Main.java");

  const ws = useRef<WebSocket | null>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const [candidateName, setCandidateName] = useState<string>("");

  const currentQuestion = questions[activeIdx] || null;
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);

  // Add these state variables at the top with your other useState
  const [duration, setDuration] = useState<number>(0); // Total duration in minutes
  const [timeLeft, setTimeLeft] = useState<number>(0); // Remaining seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const TIMER_STORAGE_KEY = `exam_timer_${examId}_${userId}`;

  const getInitials = () => {
    if (!candidateName) {
      return userId?.slice(0, 2).toUpperCase() || "NA";
    }

    const parts = candidateName.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase() || "";
    const last = parts[1]?.charAt(0).toUpperCase() || "";

    return last ? first + last : first;
  };

  const buildPayload = (extra: Record<string, any> = {}) => {
    const payload: any = {
      code: code.trim(),
      language,
      ...extra,
    };

    if (language === "java") {
      payload.file_name = fileName?.trim() || "Main.java";
    }

    return payload;
  };

  const handleTimeUp = async () => {
    localStorage.removeItem(TIMER_STORAGE_KEY);
    toast.warning("Time's up! Submitting your answers...");
    await submitCode();
    toast.error("Exam time ended. Redirecting...");
    setTimeout(() => navigate("/overview"), 3000);
  };

  // Timer useEffect
  useEffect(() => {
    if (!questions.length || duration === 0 || !userId || !examId) return;

    const totalSeconds = duration * 60;
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);

    let remainingSeconds: number;

    if (saved) {
      const savedData = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - savedData.startedAt) / 1000);
      remainingSeconds = Math.max(totalSeconds - elapsed, 0);
    } else {
      remainingSeconds = totalSeconds;
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          startedAt: Date.now(),
          totalSeconds,
        }),
      );
    }

    setTimeLeft(remainingSeconds);
    setExamStartedAt(Date.now());

    if (remainingSeconds <= 0) {
      setIsTimeUp(true);
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem(TIMER_STORAGE_KEY);
          setIsTimeUp(true);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, duration, userId, examId]);

  // Anti-tab-switching useEffect
  useEffect(() => {
    let tabSwitchCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;

        if (tabSwitchCount === 1) {
          toast.warning(
            "Warning: Switching tabs is not allowed during the exam!",
          );
        } else if (tabSwitchCount >= 2) {
          toast.error(
            "Multiple tab switches detected. Auto-submitting exam for security reasons.",
          );
          handleTimeUp();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "t" || e.key === "n" || e.key === "w")
      ) {
        e.preventDefault();
        toast.error("Opening new tabs is disabled during the exam.");
        toast.warning(
          "This attempt has been recorded. Exam will auto-submit on repeated violation.",
        );
        tabSwitchCount++;

        if (tabSwitchCount >= 2) {
          toast.error("Violation detected. Auto-submitting your exam.");
          handleTimeUp();
        }
      }
    };

    const handleAuxClick = (e: MouseEvent) => {
      if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
        e.preventDefault();
        toast.error("Opening links in new tabs is disabled.");
        tabSwitchCount++;
        if (tabSwitchCount >= 2) {
          toast.error("Violation detected. Auto-submitting your exam.");
          handleTimeUp();
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (e.ctrlKey || e.shiftKey) {
        e.preventDefault();
        toast.error("Right-click actions are restricted during the exam.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("auxclick", handleAuxClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("auxclick", handleAuxClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Format time helper
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Fetch exam details
  useEffect(() => {
    if (!examId || !token) return;

    const fetchExamDetails = async () => {
      try {
        // First try to get exam with questions
        const res = await fetch(
          `https://api.devtalent.securxperts.com:8000/exam/${examId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.ok) {
          const data = await res.json();

          // Handle different question formats
          let questionsData = [];

          if (data.questions && typeof data.questions === "object") {
            // Convert questions object to array
            questionsData = Object.values(data.questions).map(
              (q: any, index) => ({
                ...q,
                exam_question_index: index,
              }),
            );
          } else if (Array.isArray(data.questions)) {
            questionsData = data.questions.map((q: any, index) => ({
              ...q,
              exam_question_index: index,
            }));
          } else if (
            data.coding_questions &&
            Array.isArray(data.coding_questions)
          ) {
            questionsData = data.coding_questions.map((q: any, index) => ({
              ...q,
              exam_question_index: index,
            }));
          }

          setQuestions(questionsData);
          setExamTitle(data.title || "Coding Exam");
          setDuration(data.duration_minutes || data.duration || 0);

          if (questionsData.length === 0) {
            toast.error(
              "No questions available for this exam. Please contact your administrator.",
            );
            // Redirect back after a delay
            setTimeout(() => {
              navigate("/overview");
            }, 3000);
          }
        } else {
          toast.error("Failed to load exam details");
          setQuestions([]);
          // Redirect back after a delay
          setTimeout(() => {
            navigate("/overview");
          }, 3000);
        }
      } catch (err) {
        console.error("Error fetching exam details:", err);
        toast.error("Network error loading exam");
        setQuestions([]);
        // Redirect back after a delay
        setTimeout(() => {
          navigate("/overview");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId, token, navigate]);

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        // Handle different JWT formats
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("Decoded JWT payload:", payload); // Debug log

          // Try different possible field names for user ID
          const userId =
            payload.user_id ||
            payload.userId ||
            payload.id ||
            payload.sub ||
            payload.candidate_id ||
            "";
          const name =
            payload.name ||
            payload.fullName ||
            payload.username ||
            payload.email ||
            "";

          setUserId(userId.toString());
          setCandidateName(name.toString());

          console.log("Set userId:", userId, "Set candidateName:", name); // Debug log
        } else {
          console.error("Invalid token format");
          // Fallback: try to extract from localStorage or use a default
          const fallbackId =
            localStorage.getItem("userId") ||
            localStorage.getItem("candidate_id") ||
            "unknown";
          setUserId(fallbackId);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
        // Fallback options
        const fallbackId =
          localStorage.getItem("userId") ||
          localStorage.getItem("candidate_id") ||
          "unknown";
        const fallbackName =
          localStorage.getItem("userName") ||
          localStorage.getItem("candidateName") ||
          "Candidate";
        setUserId(fallbackId);
        setCandidateName(fallbackName);
      }
    } else {
      console.error("No token found in localStorage");
      // Set default values when no token
      setUserId("unknown");
      setCandidateName("Candidate");
    }
  }, []);

  // Camera setup
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Auto-scroll output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  // WebSocket Run Locally
  const runLocallyWithWebSocket = () => {
    if (!code.trim()) {
      toast.error("Write some code first");
      return;
    }

    setOutput("\n");
    if (ws.current) ws.current.close();

    const wsUrl = `wss://apicompiler.devtalent.securxperts.com:8000/interactive-compiler/${language}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      appendOutput("\n");
      ws.current?.send(JSON.stringify(buildPayload()));
    };

    ws.current.onmessage = (event) => appendOutput(event.data);
    ws.current.onerror = () => appendOutput("\nError: Connection failed.");
    ws.current.onclose = () => appendOutput("\nExecution finished.");
  };

  const sendInput = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast.warning("Program not running!");
      return;
    }
    if (!customInput.trim()) return;
    ws.current.send(customInput.trim() + "\n");
    appendOutput(`→ ${customInput.trim()}\n`);
    setCustomInput("");
  };

  const appendOutput = (text: string) => setOutput((prev) => prev + text);

  useEffect(() => {
    return () => ws.current?.close();
  }, []);

  // Run Test Cases & Submit
  const runTestCases = async () => {
    if (!currentQuestion || !code.trim()) {
      toast.error("Write some code first");
      return;
    }

    const payload = JSON.stringify([
      {
        exam_question_id: parseInt(currentQuestion.exam_question_index),
        code: code.trim(),
      },
    ]);

    setOutput("Running test cases...");

    try {
      const response = await fetch(
        `https://apicompiler.devtalent.securxperts.com:8000/interpreter/test_cases?language=${language}&current_user=${userId}&exam_id=${examId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Test failed");

      setOutput(JSON.stringify(data, null, 2));
      const allPassed = data.every((test: any) =>
        test.result?.every((r: any) => r.success),
      );
      toast.success(
        allPassed ? "All test cases passed!" : "Some test cases failed",
      );
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      toast.error("Failed to run test cases");
    }
  };

  const submitCode = async () => {
    if (!currentQuestion || !code.trim()) {
      toast.error("Write some code first");
      return;
    }

    toast.custom(
      (t) => (
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-auto border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Exam?</h3>
          <p className="text-sm text-gray-600 mb-6">
            This will end your exam and submit all answers.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                toast.loading("Submitting your exam...", {
                  id: "submit-loading",
                });
                const payload = JSON.stringify([
                  {
                    exam_question_id: parseInt(
                      currentQuestion.exam_question_index,
                    ),
                    code: code.trim(),
                  },
                ]);

                try {
                  const response = await fetch(
                    `https://apicompiler.devtalent.securxperts.com:8000/interpreter/submit?language=${language}&exam_id=${examId}&candidate_id=${userId}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: payload,
                    },
                  );

                  const data = await response.json();
                  if (!response.ok)
                    throw new Error(data.message || "result already submitted");

                  // Clean up timer on successful submit
                  localStorage.removeItem(TIMER_STORAGE_KEY);

                  toast.success("Exam submitted successfully!", {
                    id: "submit-loading",
                  });
                  setTimeout(() => navigate("/overview"), 2000);
                } catch (err: any) {
                  toast.error(err.message || "Submission failed", {
                    id: "submit-loading",
                  });
                }
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition shadow-lg"
            >
              Yes, Submit
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-2xl text-gray-800">Loading Exam...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6">
            This exam doesn't have any questions assigned yet. Please contact
            your administrator or try again later.
          </p>
          <button
            onClick={() => navigate("/overview")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const saveCode = () => {
    toast.success("Code saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-white border-b shadow-sm px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4 w-full">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-2 sm:gap-3 lg:gap-0">
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xs sm:text-xs lg:text-base">
              {getInitials()}
            </div>

            <h1 className="text-sm sm:text-base lg:text-xl font-bold">
              STM CODING 1
            </h1>
          </div>

          {/* Center Progress - Hidden on small screens */}
          <div className="flex-1 mx-2 sm:mx-4 md:mx-6 lg:mx-8 hidden lg:block">
            <p className="text-xs text-gray-400 mb-1">OVERALL PROGRESS</p>
            <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600"
                style={{
                  width: `${((activeIdx + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <div className="text-center hidden sm:block">
              <p className="text-xs text-gray-400">TIME REMAINING</p>
              <p className="font-mono font-bold text-xs sm:text-sm md:text-base">
                {formatTime(timeLeft)}
              </p>
            </div>

            <div className="text-center hidden sm:block">
              <p className="text-xs text-gray-400">CANDIDATE ID</p>
              <p className="font-mono font-bold text-xs sm:text-sm md:text-base">
                {userId}
              </p>
            </div>

            {/* Mobile Time & ID Display */}
            <div className="flex flex-col sm:hidden text-center">
              <p className="text-xs text-gray-400">TIME</p>
              <p className="font-mono font-bold text-xs">
                {formatTime(timeLeft)}
              </p>
            </div>

            {/* Camera */}
            <div className="relative">
              <div className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 rounded-lg overflow-hidden border bg-black">
                {cameraError ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="text-gray-500 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}
              </div>
              <span className="absolute top-0.5 left-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-red-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1600px] mx-auto p-2 sm:p-3 md:p-4 lg:p-6">
        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-3 sm:mb-4">
          <p className="text-xs text-gray-400 mb-1">OVERALL PROGRESS</p>
          <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600"
              style={{
                width: `${((activeIdx + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] md:grid-cols-[80px_1.1fr_1.4fr] gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {/* QNS */}
          <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
            <p className="text-xs font-bold text-purple-700 text-le hidden sm:block">
              QNS
            </p>
            <p className="text-xs font-bold text-purple-700 text-center sm:hidden">
              Q
            </p>
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xs md:text-sm ${
                  i === activeIdx
                    ? "bg-indigo-600 text-white"
                    : "bg-white border text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* LEFT PANEL */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow p-2 sm:p-3 md:p-4 lg:p-6 space-y-3 sm:space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                {currentQuestion.title}
              </h2>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <span className="px-1.5 sm:px-2 md:px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                  Hard
                </span>
                <span className="px-1.5 sm:px-2 md:px-3 py-1 text-xs rounded-full bg-gray-100 font-bold">
                  {currentQuestion.score} PTS
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                Problem Statement
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap text-xs sm:text-xs md:text-sm">
                {currentQuestion.question}
              </p>
            </div>

            {currentQuestion.description && (
              <div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap text-xs sm:text-xs md:text-sm">
                  {currentQuestion.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div className="bg-indigo-50 p-2 sm:p-3 md:p-4 rounded-lg">
                <p className="font-semibold mb-1 text-xs sm:text-sm md:text-sm">
                  Sample Input
                </p>
                <pre className="text-indigo-700 text-xs sm:text-xs md:text-sm overflow-x-auto">
                  {currentQuestion.sample_inputs}
                </pre>
              </div>

              <div className="bg-indigo-50 p-2 sm:p-3 md:p-4 rounded-lg">
                <p className="font-semibold mb-1 text-xs sm:text-sm md:text-sm">
                  Expected Output
                </p>
                <pre className="text-indigo-700 text-xs sm:text-xs md:text-sm overflow-x-auto">
                  {currentQuestion.sample_outputs}
                </pre>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#0f172a] rounded-lg sm:rounded-xl shadow overflow-hidden flex flex-col order-1 md:order-2">
            <div className="p-2 sm:p-3 md:p-4 bg-white flex justify-between items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm md:text-base"
              >
                <option value="python">Python 3.10</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
              </select>
            </div>

            <AceEditor
              ref={editorRef}
              mode={language}
              theme="textmate"
              value={code}
              onChange={setCode}
              width="100%"
              height="250px sm:h-300px md:h-350px lg:h-380px"
              fontSize={10}
              showPrintMargin={false}
              setOptions={{ showLineNumbers: true, tabSize: 4 }}
            />

            <div className="p-2 sm:p-3 md:p-4 bg-black text-green-400 text-xs sm:text-xs md:text-sm h-24 sm:h-32 md:h-40 overflow-auto">
              <pre>{output || "Run your code to see results"}</pre>
              <div ref={outputEndRef} />
            </div>

            <div className="m-2 sm:m-3 md:m-4 p-2 sm:p-3 md:p-4 bg-white rounded-lg sm:rounded-xl shadow border border-gray-100 space-y-2 sm:space-y-3">
              {/* Input + Send row */}
              <div className="flex gap-1.5 sm:gap-2 md:gap-3">
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="10 25 15"
                  className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm md:text-base"
                />
                <button
                  onClick={sendInput}
                  className="px-2 sm:px-3 md:px-4 sm:px-6 bg-green-600 text-white rounded-lg text-xs sm:text-sm md:text-base"
                >
                  Send
                </button>
              </div>

              {/* Action buttons row */}
              <div className="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2 md:gap-4">
                <button
                  onClick={runLocallyWithWebSocket}
                  className="px-2 sm:px-3 md:px-4 sm:px-6 py-1.5 sm:py-2 bg-purple-700 text-white rounded-lg text-xs sm:text-sm md:text-base"
                >
                  Run Code
                </button>

                <button
                  onClick={runTestCases}
                  className="px-2 sm:px-3 md:px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-200 rounded-lg text-xs sm:text-sm md:text-base"
                >
                  Run Test Cases
                </button>

                <button
                  onClick={saveCode}
                  className="px-2 sm:px-3 md:px-4 sm:px-6 py-1.5 sm:py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs sm:text-sm md:text-base"
                >
                  Save
                </button>

                <button
                  onClick={submitCode}
                  className="px-2 sm:px-3 md:px-4 sm:px-6 sm:px-8 py-1.5 sm:py-2 bg-purple-700 text-white rounded-lg text-xs sm:text-sm md:text-base"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineCompiler;
