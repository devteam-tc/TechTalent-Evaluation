import React from "react";
import { Plus, Upload, Trash2 } from "lucide-react";
import {
  FormErrors,
  QuestionItem,
  McqQuestion,
} from "../../types";
import InputField from "../../Shared/InputField";
import TextAreaField from "../../Shared/TextAreaField";

interface MCQQuestionEditorProps {
  questions: QuestionItem[];
  formErrors: FormErrors;
  onAddQuestion: () => void;
  onBulkUpload: () => void;
  onRemoveQuestion: (id: number) => void;
  onUpdateQuestion: (
    id: number,
    field: keyof McqQuestion,
    value: string | number | null | string[]
  ) => void;
  onSaveQuestion: (question: McqQuestion) => void;
}

const MCQQuestionEditor: React.FC<MCQQuestionEditorProps> = ({
  questions,
  formErrors,
  onAddQuestion,
  onBulkUpload,
  onRemoveQuestion,
  onUpdateQuestion,
  onSaveQuestion,
}) => {
  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-semibold text-[#1f2937]">
          MCQ Questions
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onBulkUpload}
            className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
            style={{
              background: "white",
              color: "#1f2937",
              border: "1px solid #e1e3ea",
            }}
          >
            <Upload size={16} />
            Bulk Upload
          </button>
          <button
            onClick={onAddQuestion}
            className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
            }}
          >
            <Plus size={16} />
            Add MCQ Question
          </button>
        </div>
      </div>

      {formErrors.questions && (
        <p className="mb-3 text-[12px] text-red-500">
          {formErrors.questions}
        </p>
      )}

      {questions.length === 0 ? (
        <div className="flex min-h-[150px] items-center justify-center text-center text-[16px] text-[#6b7280]">
          No MCQ questions added yet. Click "Add MCQ Question" to get started.
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((question, index) => {
            if (question.type === "MCQ") {
              return (
                <div
                  key={question.id}
                  className="rounded-[14px] border border-[#dde1ea] bg-white p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
                        Question {index + 1}
                      </span>
                      <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#6b7280]">
                        MCQ
                      </span>
                      <span className="text-[13px] text-[#6b7280]">
                        {question.marks} marks
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveQuestion(question.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <TextAreaField
                    label="Question Text"
                    value={question.questionText}
                    onChange={(value) =>
                      onUpdateQuestion(question.id, "questionText", value)
                    }
                    placeholder="Enter your MCQ question here..."
                    rows={2}
                    error={formErrors[`questionText_${question.id}`]}
                  />

                  <div className="mt-4">
                    <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                      Options
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-answer-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() =>
                                onUpdateQuestion(
                                  question.id,
                                  "correctAnswer",
                                  optionIndex,
                                )
                              }
                              className="h-4 w-4"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const updatedOptions = [...question.options];
                                updatedOptions[optionIndex] = e.target.value;
                                onUpdateQuestion(
                                  question.id,
                                  "options",
                                  updatedOptions,
                                );
                              }}
                              className="h-[42px] w-full rounded-[10px] border border-[#d9dde5] px-4 outline-none"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                          {formErrors[`option_${question.id}_${optionIndex}`] && (
                            <p className="ml-7 mt-1 text-[12px] text-red-500">
                              {formErrors[`option_${question.id}_${optionIndex}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-[12px] text-[#6b7280]">
                      Select the radio button for the correct answer
                    </p>
                    {formErrors[`correctAnswer_${question.id}`] && (
                      <p className="mt-1 text-[12px] text-red-500">
                        {formErrors[`correctAnswer_${question.id}`]}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-end gap-3">
                    <div className="max-w-[160px]">
                      <InputField
                        label="Marks"
                        value={question.marks}
                        onChange={(value) =>
                          onUpdateQuestion(
                            question.id,
                            "marks",
                            Number(value || 0),
                          )
                        }
                        type="number"
                        error={formErrors[`marks_${question.id}`]}
                      />
                    </div>
                    <button
                      onClick={() => onSaveQuestion(question)}
                      className="flex h-[42px] items-center justify-center rounded-[10px] px-4 text-[14px] font-medium text-white"
                      style={{
                        background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MCQQuestionEditor;
