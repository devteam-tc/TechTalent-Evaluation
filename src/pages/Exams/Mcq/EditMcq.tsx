import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import InputField from "../Shared/InputField";
import TextAreaField from "../Shared/TextAreaField";
import SelectField from "../Shared/SelectField";

interface QuestionType {
  id: number | string;
  backendId?: number;
  questionText: string;
  options: string[];
  correctAnswer: number | null;
  marks: number;
}

interface MCQQuestionsSectionProps {
  questions: QuestionType[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
}

const MCQQuestionsSection: React.FC<MCQQuestionsSectionProps> = ({ questions, setQuestions }) => {


  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(), // Use Date.now() for unique frontend ID
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        marks: 1,
      },
    ]);
  };

  const removeQuestion = async (id: number | string) => {
    const questionToRemove = questions.find(q => q.id === id);
    
    // If it exists in backend, make API call to delete
    if (questionToRemove && questionToRemove.backendId) {
      if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
        return; // Cancel deletion
      }
      
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {};
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
        
        const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/questions/${questionToRemove.backendId}`, {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error("Delete request failed");
        }
      } catch (err) {
        console.error("Failed to delete question:", err);
        alert("Failed to delete the question from the server.");
        return; // Don't remove locally if it failed
      }
    }

    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleChange = (id: number | string, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleOptionChange = (
    id: number | string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt,
            ),
          }
          : q,
      ),
    );
  };

  return (
    <div className="space-y-5">
      {/* MCQ Questions */}
      <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[22px] font-semibold text-[#1f2937]">
            MCQ Questions
          </h2>

          <div className="flex gap-3">
            <button
              className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
              style={{
                background: "white",
                color: "#1f2937",
                border: "1px solid #e1e3ea",
              }}
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>

            <button
              onClick={addQuestion}
              className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add MCQ Question
            </button>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-[14px] border border-[#dde1ea] bg-white p-4 mb-5"
          >
            {/* Top row */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
                  Question {index + 1}
                </span>
                <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#374151]">
                  MCQ
                </span>
                <span className="text-[13px] text-[#6b7280]">
                  {q.marks} marks
                </span>
              </div>

              <Trash2
                className="w-5 h-5 text-red-500 cursor-pointer"
                onClick={() => removeQuestion(q.id)}
              />
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <TextAreaField
                label="Question Text"
                value={q.questionText}
                onChange={(value) => handleChange(q.id, "questionText", value)}
                placeholder="Enter the question..."
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Options
              </label>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctAnswer === optionIndex}
                    onChange={() =>
                      handleChange(q.id, "correctAnswer", optionIndex)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <InputField
                    label={`Option ${String.fromCharCode(65 + optionIndex)}`}
                    value={option}
                    onChange={(value) =>
                      handleOptionChange(q.id, optionIndex, value)
                    }
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                  />
                </div>
              ))}
            </div>

            {/* Marks */}
            <div className="max-w-[160px]">
              <InputField
                label="Marks"
                value={q.marks.toString()}
                onChange={(value) =>
                  handleChange(q.id, "marks", Number(value || 0))
                }
                type="number"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Supported Course Types */}
      <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
        <h2 className="text-[22px] font-semibold text-[#1f2937] mb-6">
          Supported Course Types
        </h2>

        <div className="flex flex-wrap gap-10">
          {["Python", "Java", "C++", "JavaScript"].map((course) => (
            <label
              key={course}
              className="flex items-center gap-3 text-[#374151] cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded-md border-[#d1d5db] accent-blue-600"
              />
              <span className="text-[14px] font-medium">{course}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

interface EditMcqProps {
  examData?: any;
  onSave?: (data: any) => void;
}

const EditMcq: React.FC<EditMcqProps> = ({
  examData: propExamData,
  onSave,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exam data from either props or navigation state
  const examData = propExamData || location.state?.examData;

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const [formData, setFormData] = useState({
    examName: examData?.title || examData?.examName || "",
    course: examData?.course || "Technical",
    description: examData?.description || "",
    duration: parseInt(examData?.duration) || 120,
    totalMarks: examData?.totalMarks || 100,
    passingScore: examData?.passingScore || 60,
    examType: examData?.type || examData?.examType || "MCQ Only",
  });

  // Fetch existing questions when examData is available
  useEffect(() => {
    const fetchQuestions = async () => {
      const examId = examData?.id || examData?.exam_id;
      if (!examId) return;

      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

        const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions?limit=500`, { headers });
        
        if (response.ok) {
          const data = await response.json();
          const fetchedQuestions = data.items || data;
          
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            const mappedQuestions = fetchedQuestions.map((q: any) => ({
              id: q.id,
              backendId: q.id,
              questionText: q.text || q.questionText || "",
              options: q.options ? q.options.map((opt: any) => opt.text || opt) : ["", "", "", ""],
              correctAnswer: q.correct_index ?? null,
              marks: q.marks || 1
            }));
            setQuestions(mappedQuestions);
          } else {
            // Add a default empty question if none exist
            setQuestions([{
              id: Date.now(),
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: null,
              marks: 1,
            }]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing questions", err);
      }
    };

    fetchQuestions();
  }, [examData]);

  // Update form when examData changes
  useEffect(() => {
    if (examData) {
      setFormData({
        examName: examData?.title || examData?.examName || "",
        course: examData?.course || "Technical",
        description: examData?.description || "",
        duration: parseInt(examData?.duration) || 120,
        totalMarks: examData?.totalMarks || 100,
        passingScore: examData?.passingScore || 60,
        examType: examData?.type || examData?.examType || "MCQ Only",
      });
    }
  }, [examData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const examId = examData?.id || examData?.exam_id;
      if (!examId) {
        console.error("No exam ID found to update");
        if (onSave) onSave(formData);
        navigate("/exams");
        return;
      }

      const requestBody = {
        title: formData.examName,
        description: formData.description,
        duration_minutes: formData.duration,
        is_active: examData?.status === "Active" || examData?.is_active !== false,
        total_marks: formData.totalMarks,
        pass_percentage: formData.passingScore
      };

      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Save questions
        for (const question of questions) {
          if (!question.questionText.trim()) continue; // Skip empty questions

          const questionBody = {
            text: question.questionText,
            image_url: "",
            options: question.options.map(option => ({
              text: option,
              image_url: ""
            })),
            correct_index: question.correctAnswer,
            subject_name: "MCQ",
            marks: Number(question.marks) || 1,
          };

          try {
            if (question.backendId) {
              // Update existing question
              await fetch(`${API_BASE_URL}/ind/mcq/admin/questions/${question.backendId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(questionBody),
              });
            } else {
              // Create new question
              await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(questionBody),
              });
            }
          } catch (err) {
            console.error("Failed to save a question:", err);
          }
        }

        if (onSave) {
          onSave(formData);
        }
        navigate("/exams");
      } else {
        const errData = await response.json();
        console.error("Failed to update exam:", errData);
        alert("Failed to update exam. Please try again.");
      }
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("An error occurred while updating the exam.");
    }
  };

  const handleBack = () => {
    navigate("/exams");
  };

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
        {/* Back */}
        <button
          onClick={handleBack}
          className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </button>

        {/* Header */}
        <h1 className="text-[28px] font-bold text-[#1f2937]">
          Edit MCQ Exam Details
        </h1>
        <p className="mb-4 text-[14px] text-[#6b7280]">
          Update exam information and settings
        </p>

        <div className="space-y-5">
          {/* Card */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
              Basic Exam Details
            </h2>

            <div className="space-y-4">
              <InputField
                label="Exam Name"
                value={formData.examName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, examName: value }))
                }
                placeholder="e.g., Data Structures MCQ Exam"
              />

              <SelectField
                label="Select Course"
                value={formData.course}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, course: value }))
                }
                options={["Technical", "Non-Technical"]}
              />

              <TextAreaField
                label="Exam Description"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Describe the exam objectives and content..."
                rows={4}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Duration (minutes)"
                  value={formData.duration.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(value) || 120,
                    }))
                  }
                  type="number"
                />
                <InputField
                  label="Total Marks"
                  value={formData.totalMarks.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalMarks: parseInt(value) || 100,
                    }))
                  }
                  type="number"
                />
                <InputField
                  label="Passing Score (%)"
                  value={formData.passingScore.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingScore: parseInt(value) || 60,
                    }))
                  }
                  type="number"
                />
                <SelectField
                  label="Exam Type"
                  value={formData.examType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, examType: value }))
                  }
                  options={["MCQ Only"]}
                />
              </div>
            </div>
          </div>

          {/* MCQ Questions Section */}
          <MCQQuestionsSection questions={questions} setQuestions={setQuestions} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 pb-6 sm:text-left text-center">
            <button
              onClick={handleBack}
              className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center sm:justify-start gap-4 rounded-[8px] px-5 py-3 text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMcq;
