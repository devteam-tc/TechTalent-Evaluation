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
  examId?: number | string;
}

const MCQQuestionsSection: React.FC<MCQQuestionsSectionProps> = ({ questions, setQuestions, examId }) => {

  const handleBulkUpload = () => {
    if (!examId) {
      alert("No exam ID found to upload questions.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx,.json";
    fileInput.multiple = false;

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Bulk upload file selected:", file.name);

        const loadingToast = document.createElement('div');
        loadingToast.style.cssText = `
          position:fixed;top:20px;right:20px;background:#4F39F6;color:#fff;
          padding:12px 20px;border-radius:8px;z-index:9999;
          font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15);
        `;
        loadingToast.textContent = 'Uploading questions...';
        document.body.appendChild(loadingToast);

        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'accept': 'application/json'
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions/bulk?skip_invalid=false`, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);

            let displayError = "";
            try {
              const errJson = JSON.parse(errorText);
              const msg = errJson.message || errJson.detail?.message || errJson.error;
              const subDetail = errJson.detail?.detail || errJson.detail || errJson.error_details;

              if (msg && subDetail && typeof subDetail === 'object') {
                displayError = `${msg}: Row ${subDetail.row || '?'} - ${subDetail.error || ''}`;
              } else if (errJson.detail) {
                if (typeof errJson.detail === 'string') {
                  displayError = errJson.detail;
                } else if (Array.isArray(errJson.detail)) {
                  displayError = errJson.detail.map((d: any) => `${d.loc?.join('.') || 'Error'}: ${d.msg}`).join('\n');
                } else {
                  displayError = errJson.detail.message || JSON.stringify(errJson.detail);
                }
              } else if (errJson.message) {
                displayError = errJson.message;
              }
            } catch (pErr) {
              // ignore
            }

            throw new Error(displayError || `Failed to upload questions: Status ${response.status}`);
          }

          const result = await response.json();
          console.log('Bulk upload success:', result);

          loadingToast.textContent = 'Questions uploaded successfully!';
          loadingToast.style.background = '#10b981';

          const items = Array.isArray(result) 
            ? result 
            : (result?.items || result?.questions || result?.data || null);

          if (Array.isArray(items) && items.length > 0) {
            const newQuestions: QuestionType[] = items.map((q: any, index: number) => ({
              id: q.id || (Date.now() + index),
              backendId: q.id,
              questionText: q.text || q.questionText || "",
              options: q.options 
                ? q.options.map((opt: any) => typeof opt === "string" ? opt : (opt.text || ""))
                : ["", "", "", ""],
              correctAnswer: q.correct_index !== undefined ? q.correct_index : (q.correctAnswer ?? null),
              marks: q.marks || 1,
            }));
            
            setQuestions((prev) => {
              const filtered = prev.filter(q => q.questionText.trim() !== "" || q.options.some(o => o.trim() !== ""));
              return [...filtered, ...newQuestions];
            });
          } else {
            // Fallback: fetch questions from DB
            try {
              const fetchResponse = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions?limit=500`, {
                headers: {
                  'Authorization': `Bearer ${adminToken}`,
                  'Content-Type': 'application/json'
                }
              });
              if (fetchResponse.ok) {
                const fetchedData = await fetchResponse.json();
                const fetchedItems = fetchedData.items || fetchedData;
                if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
                  const mappedQuestions: QuestionType[] = fetchedItems.map((q: any) => ({
                    id: q.id,
                    backendId: q.id,
                    questionText: q.text || q.questionText || "",
                    options: q.options ? q.options.map((opt: any) => typeof opt === "string" ? opt : (opt.text || "")) : ["", "", "", ""],
                    correctAnswer: q.correct_index ?? null,
                    marks: q.marks || 1
                  }));
                  setQuestions(mappedQuestions);
                } else {
                  alert('✅ Bulk questions uploaded successfully!');
                }
              } else {
                alert('✅ Bulk questions uploaded successfully!');
              }
            } catch (fetchErr) {
              console.error("Failed to fetch updated questions list:", fetchErr);
              alert('✅ Bulk questions uploaded successfully!');
            }
          }

          setTimeout(() => {
            if (document.body.contains(loadingToast)) {
              document.body.removeChild(loadingToast);
            }
          }, 1500);

        } catch (error) {
          console.error('Error during bulk upload:', error);
          loadingToast.textContent = 'Error uploading questions';
          loadingToast.style.background = '#ef4444';

          setTimeout(() => {
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to upload questions'}`);
            if (document.body.contains(loadingToast)) {
              document.body.removeChild(loadingToast);
            }
          }, 1500);
        }
      }
    };

    fileInput.click();
  };


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
              onClick={handleBulkUpload}
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
  const examId = examData?.id || examData?.exam_id;

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
          <MCQQuestionsSection questions={questions} setQuestions={setQuestions} examId={examId} />

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
