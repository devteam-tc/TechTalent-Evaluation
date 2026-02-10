import React, { useState, useEffect } from "react";

import axios from "axios";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {

  Dialog,

  DialogContent,

  DialogDescription,

  DialogHeader,

  DialogTitle,

} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



interface College {

  id: number;

  name: string;

  passkey_expires_at?: string;

  expiry_date?: string;

}



interface CodingQuestion {

  id: number | string;

  title?: string;

  question?: string;

  description?: string;

  sample_inputs?: string;

  sample_outputs?: string;

  test_cases?: { testcase: number; input: string; output: string }[];

}



interface Exam {

  id: number | string;

  title?: string;

  description?: string;

  window_start?: string;

  window_end?: string;

  duration_minutes?: number;

  duration?: number;

  score?: number;

  category?: string;

  is_active?: boolean;

  coding_questions?: any[];   // <-- safe here because API structure varies

  college_id?: number;

  college?: { id: number };

}





export default function CoddingExam() {

  // --- Coding question creation (individual) ---

  const [questionTitle, setQuestionTitle] = useState("");

  const [description, setDescription] = useState("");

  const [sampleInputs, setSampleInputs] = useState("");

  const [sampleOutputs, setSampleOutputs] = useState("");

  const [activeTab, setActiveTab] = useState("exams");



  const [codingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([]);

  const [colleges, setColleges] = useState<College[]>([]);

  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  const [selectedExamCollegeName, setSelectedExamCollegeName] =

    useState<string>("");



  const activeColleges = colleges.filter((college) => {

    const expiry = college.passkey_expires_at || college.expiry_date;

    return expiry && new Date(expiry) > new Date();

  });



  const fetchColleges = async () => {

    const token2 = localStorage.getItem("adminToken");

    try {

      const res = await axios.get(

        "https://api.devtalent.securxperts.com:8000/admin/colleges",

        {

          headers: { Authorization: `Bearer ${token2}` },

        },

      );

      setColleges(res.data || []);

    } catch (err) {

      console.error("Failed to fetch colleges:", err);

      toast.error("Failed to load colleges list");

    }

  };

  // Testcases state for individual coding question

  const [testCases, setTestCases] = useState([

    { testcase: 0, input: "", output: "" },

  ]);



  // Dialogs

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false); // for selecting coding question to add to exam

  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);

  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false);

  const [editingQuestion, setEditingQuestion] =

    useState<CodingQuestion | null>(null);

  // add coding question API

  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);

  // const [bulkFileName, setBulkFileName] = useState<string | null>(null);


  // Exams list (sample initial data)

  const [exams, setExams] = useState<Exam[]>([]);

  const [searchTerm, setSearchTerm] = useState("");



  const filteredExams = exams.filter((exam) =>

    exam.title?.toLowerCase().includes(searchTerm.toLowerCase()),

  );



  const fetchExams = async (filters = {}) => {

    const token2 = localStorage.getItem("adminToken");

    try {

      const res = await axios.get(

        "https://api.devtalent.securxperts.com:8000/exam/admin/get",

        {

          params: filters,

          headers: {

            Authorization: `Bearer ${token2}`,

          },

        },

      );







      // Normalize or ensure safe defaults

      const normalized = (res.data || []).map((exam) => ({

        id: exam.id ?? exam.exam_id ?? null,

        title: exam.title || "",

        description: exam.description || "",

        window_start: exam.window_start || "",

        window_end: exam.window_end || "",

        duration_minutes: exam.duration_minutes ?? exam.duration ?? 0,

        score: exam.score ?? 0,

        category: exam.category || "",

        is_active: exam.is_active ?? false,

        coding_questions: exam.questions || exam.coding_questions || [],

      }));



      setExams(normalized);

    } catch (err) {

      console.error("Failed to fetch exams:", err);

      toast.error(err.response?.data?.message || "Failed to load exams");

    }

  };



  useEffect(() => {

    fetchCodingQuestions(null);

    fetchExams();

    fetchColleges();

  }, []);



  // Bulk upload

  const [bulkExamId, setBulkExamId] = useState("");

  // const [bulkFile, setBulkFile] = useState(null);

  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFileName, setBulkFileName] = useState<string>("");

  const handleRemoveFile = () => {
    setBulkFile(null);
    setBulkFileName("");

    const fileInput = document.getElementById("bulk-file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };



  // Individual question fields (for MCQ-like; kept from your original)

  const [individualExamId, setIndividualExamId] = useState("");

  const [questionText, setQuestionText] = useState("");

  const [subjectName, setSubjectName] = useState("");

  const [individualOptions, setIndividualOptions] = useState([""]);

  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState("");



  const getCurrentDateTime = () => {

    const now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);

  };



  // Exam form

  const [examData, setExamData] = useState({

    title: "",

    description: "",

    window_start: "",

    window_end: "",

    duration_minutes: 30,

    score: "",

    is_active: false,

    category: "",

    college_id: "",

    // coding_questions will be appended here when creating/updating exam

    // format: [{ question_id: 123, score: 10 }, ...]

  });



  const [isEditExamMode, setIsEditExamMode] = useState(false);

  const [editingExam, setEditingExam] = useState(null);



  // --- New: selected coding questions for the exam ---

  // Structure: [{ question_id, score, questionObj }]

  const [selectedCodingQuestions, setSelectedCodingQuestions] = useState<

    { question_id: number | string; score: number; questionObj?: CodingQuestion | null }[]

  >([]);



  // For the question selection dialog

  // NOTE: we store a normalized `.id` on selectedQuestionToAdd for consistent comparisons

  const [selectedQuestionToAdd, setSelectedQuestionToAdd] =

    useState<CodingQuestion | null>(null);

  const [selectedQuestionScore, setSelectedQuestionScore] = useState("");



  // ----------- Functions for testcases (individual question) -------------

  const addTestCase = () => {

    setTestCases([

      ...testCases,

      { testcase: testCases.length, input: "", output: "" },

    ]);

  };



  const removeTestCase = (index) => {

    const updated = testCases.filter((_, i) => i !== index);

    updated.forEach((tc, i) => (tc.testcase = i));

    setTestCases(updated);

  };



  const updateTestCase = (index, field, value) => {

    const updated = [...testCases];

    updated[index][field] = value;

    setTestCases(updated);

  };



  // ----------- Individual coding question submit (API) -------------

  const handleIndividualSubmit = async (e) => {

    e.preventDefault();



    // Basic validation

    if (

      !questionTitle ||

      !questionText ||

      !description ||

      !sampleInputs ||

      !sampleOutputs

    ) {

      toast.error("All fields are required");

      return;

    }



    if (testCases.some((tc) => !tc.input || !tc.output)) {

      toast.error("Test case input and output cannot be empty");

      return;

    }



    try {

      const payload = {

        title: questionTitle,

        question: questionText,

        description,

        sample_inputs: sampleInputs,

        sample_outputs: sampleOutputs,

        test_cases: testCases,

      };

      const token2 = localStorage.getItem("adminToken");

      const res = await axios.post(

        "https://api.devtalent.securxperts.com:8000/compiler-questions/add",

        payload,

        {

          headers: {

            Authorization: `Bearer ${token2}`,

            "Content-Type": "application/json",

          },

        },

      );



      toast.success("Coding question added successfully");

      setIsIndividualDialogOpen(false);



      // refresh list from API so the newly created question is available

      fetchCodingQuestions(null);



      // reset fields

      setQuestionTitle("");

      setQuestionText("");

      setDescription("");

      setSampleInputs("");

      setSampleOutputs("");

      setTestCases([{ testcase: 0, input: "", output: "" }]);

    } catch (error) {

      console.error(error);

      toast.error(

        error.response?.data?.message || "Failed to add coding question",

      );

    }

  };



  const handleOpenEditQuestion = (q: CodingQuestion) => {

    setEditingQuestion(q);

    setQuestionTitle(q.title || "");

    setQuestionText(q.question || "");

    setDescription(q.description || "");

    setSampleInputs(q.sample_inputs || "");

    setSampleOutputs(q.sample_outputs || "");



    // Load test cases if present

    setTestCases(

      q.test_cases?.length

        ? q.test_cases

        : [{ testcase: 0, input: "", output: "" }]

    );



    setIsEditQuestionOpen(true);

  };



  const handleUpdateQuestion = async (e: React.FormEvent) => {

    e.preventDefault();



    if (!editingQuestion?.id) {

      toast.error("Invalid question");

      return;

    }



    try {

      const payload = {

        title: questionTitle,

        question: questionText,

        description,

        sample_inputs: sampleInputs,

        sample_outputs: sampleOutputs,

        test_cases: testCases,

      };



      const token2 = localStorage.getItem("adminToken");



      await axios.put(

        "https://api.devtalent.securxperts.com:8000/compiler-questions/update",

        payload,

        {

          params: { question_id: editingQuestion.id },

          headers: {

            Authorization: `Bearer ${token2}`,

            "Content-Type": "application/json",

          },

        }

      );



      toast.success("Question updated successfully");



      setIsEditQuestionOpen(false);

      setEditingQuestion(null);

      fetchCodingQuestions(null);

    } catch (error) {

      console.error(error);



      const message = axios.isAxiosError(error)

        ? error.response?.data?.message || "Update failed"

        : "Update failed";



      toast.error(message);

    }



  };





  const handleUpdateExamSubmit = async (e) => {

    e.preventDefault();



    if (!editingExam?.id) {

      toast.error("Invalid exam ID");

      return;

    }



    if (!selectedExamCollegeName) {

      toast.error("Please select a college!");

      return;

    }



    try {

      const questionsObject = {};

      selectedCodingQuestions.forEach((q, index) => {

        questionsObject[index] = {

          question_bank_id: q.question_id,

          score: Number(q.score),

        };

      });



      const payload = {

        title: examData.title,

        description: examData.description,

        window_start: examData.window_start,

        window_end: examData.window_end,

        duration: Number(examData.duration_minutes),

        category: examData.category,

        college_id: Number(selectedCollegeId), // INCLUDE IN UPDATE

        questions: questionsObject,

        is_active: examData.is_active,

      };



      const token2 = localStorage.getItem("adminToken");

      await axios.put(

        "https://api.devtalent.securxperts.com:8000/exam/update",

        payload,

        {

          params: { exam_id: editingExam.id },

          headers: {

            Authorization: `Bearer ${token2}`,

            "Content-Type": "application/json",

          },

        },

      );



      toast.success("Exam Updated Successfully!");

      setIsCreateExamOpen(false);

      setEditingExam(null);

      setIsEditExamMode(false);

      setSelectedCollegeId("");

      fetchExams();

    } catch (error) {

      console.error(error);

      toast.error(error.response?.data?.message || "Exam update failed");

    }

  };



  // ----------- Fetch coding questions -------------

  const fetchCodingQuestions = async (questionId = null) => {

    const token2 = localStorage.getItem("adminToken");

    try {

      const res = await axios.get(

        "https://api.devtalent.securxperts.com:8000/compiler-questions/get",

        {

          params: {

            question_id: questionId, // can be null to get all

          },

          headers: {

            Authorization: `Bearer ${token2}`,

          },

        },

      );



      // Normalize each question when storing: keep original object but ensure we can always look up id via .id

      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((q) => {

        const normalizedId =

          q.id ?? q.question_id ?? q.questionId ?? q.questionId ?? null;

        return { ...q, id: normalizedId };

      });



      setCodingQuestions(normalized);

    } catch (error) {

      console.error("Error fetching coding questions:", error);

      toast.error(

        error.response?.data?.message || "Failed to fetch coding questions",

      );

    }

  };



  useEffect(() => {

    fetchCodingQuestions(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);



  // ----------- Bulk upload submit -------------

  const handleBulkExamChange = (value) => {

    setBulkExamId(value);

  };



  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBulkFileName(file ? file.name : null);

    setBulkFile(e.target.files[0]);

  };



  const handleBulkSubmit = async (e) => {

    e.preventDefault();



    if (!bulkFile) {

      toast.error("Please select a CSV/JSON file.");

      return;

    }



    const formData = new FormData();

    formData.append("file", bulkFile);

    const token2 = localStorage.getItem("adminToken");

    try {

      const response = await axios.post(

        "https://api.devtalent.securxperts.com:8000/compiler-questions/upload-csv",

        formData,

        {

          headers: {

            Authorization: `Bearer ${token2}`,

            "Content-Type": "multipart/form-data",

          },

        },

      );



      toast.success(

        response.data?.message || "Bulk questions uploaded successfully!",

      );

      setIsBulkDialogOpen(false);

      setBulkFile(null);

      setBulkExamId("");



      // refresh list

      fetchCodingQuestions(null);

    } catch (error) {

      console.error("Bulk upload error:", error);

      const serverMsg =

        error.response?.data?.detail ||

        error.response?.data?.message ||

        error.response?.data?.errors ||

        "Bulk upload failed. Please check your CSV.";



      if (Array.isArray(serverMsg)) {

        serverMsg.forEach((msg) => toast.error(msg));

      } else {

        toast.error(serverMsg);

      }

    }

  };



  // ----------- Exam create/edit submit -------------

  const handleCreateExamSubmit = (e) => {

    if (isEditExamMode) {

      handleUpdateExamSubmit(e);

    } else {

      handleCreateExam(e);

    }

  };



  const handleCreateExam = async (e) => {

    e.preventDefault();



    if (!selectedExamCollegeName) {

      toast.error("Please select a college!");

      return;

    }



    try {

      const questionsObject = {};

      selectedCodingQuestions.forEach((q, index) => {

        questionsObject[index] = {

          question_bank_id: q.question_id,

          score: Number(q.score),

        };

      });



      const payload = {

        title: examData.title,

        description: examData.description,

        window_start: examData.window_start,

        window_end: examData.window_end,

        duration: Number(examData.duration_minutes),

        category: examData.category,

        collage: selectedExamCollegeName,

        questions: questionsObject,

      };



      const token2 = localStorage.getItem("adminToken");

      await axios.post(

        "https://api.devtalent.securxperts.com:8000/exam/creation",

        payload,

        {

          headers: {

            Authorization: `Bearer ${token2}`,

            "Content-Type": "application/json",

          },

        },

      );



      toast.success("Exam Created Successfully!");

      setIsCreateExamOpen(false);

      setSelectedCodingQuestions([]);

      setSelectedCollegeId("");

      setSelectedExamCollegeName("");

      fetchExams();

    } catch (error) {

      console.error(error);

      toast.error(error.response?.data?.message || "Exam creation failed");

    }

  };



  // ----------- Edit & Delete helpers -------------

  const handleEditExam = (exam: Exam) => {

    setIsEditExamMode(true);

    setEditingExam(exam);



    // Fill the exam form correctly

    setExamData({

      title: exam.title || "",

      description: exam.description || "",

      category: exam.category || "",

      window_start: exam.window_start || "",

      window_end: exam.window_end || "",

      duration_minutes: exam.duration_minutes || exam.duration || 30,

      is_active: exam.is_active ?? false,

      college_id: exam.college_id || exam.college?.id || "",

    });



    setSelectedCollegeId(exam.college_id || exam.college?.id || "");



    // Populate selected questions list

    if (Array.isArray(exam.coding_questions)) {

      const mapped = exam.coding_questions.map((cq) => {

        const findId = cq.question_id ?? cq.id ?? null;



        const questionObj =

          codingQuestions.find((q) => String(q.id) === String(findId)) || null;



        return {

          question_id: findId,

          score: cq.score || 0,

          questionObj,

        };

      });



      setSelectedCodingQuestions(mapped);

    } else {

      setSelectedCodingQuestions([]);

    }



    setIsCreateExamOpen(true);

  };



  const handleDeleteExam = async (id) => {

    const token2 = localStorage.getItem("adminToken");

    try {

      await axios.delete(

        "https://api.devtalent.securxperts.com:8000/exam/delete",

        {

          params: { exam_id: id },

          headers: {

            Authorization: `Bearer ${token2}`,

          },

        },

      );



      toast.success("Exam deleted successfully");

      fetchExams(); // Reload list after delete

    } catch (error) {

      console.error("Delete exam error:", error);

      toast.error(error.response?.data?.message || "Already attend the exam");

    }

  };



  // ----------- Add / Remove coding questions from the exam UI -------------

  const addNewQuestion = () => {

    // reset selection fields and open dialog

    setSelectedQuestionToAdd(null);

    setSelectedQuestionScore("");

    setIsQuestionDialogOpen(true);

  };



  // Remove question at index

  const removeQuestion = (index) => {

    setSelectedCodingQuestions((prev) => prev.filter((_, i) => i !== index));

  };



  // Update score of already-added question

  const updateQuestionScore = (index, newScore) => {

    setSelectedCodingQuestions((prev) => {

      const copy = [...prev];

      copy[index] = { ...copy[index], score: newScore };

      return copy;

    });

  };



  // Utility to render readable label for questions

  const getQuestionLabel = (q: CodingQuestion | null) => {



    if (!q) return "";

    return q.title || q.question || `#${q.id ?? q.question_id}`;

  };

  const [questionSearchTerm, setQuestionSearchTerm] = useState("");



  // Filtered questions based on search term

  const filteredCodingQuestions = codingQuestions.filter((q) => {

    const searchLower = questionSearchTerm.toLowerCase();

    const title = (q.title || "").toLowerCase();

    const description = (q.description || "").toLowerCase();

    const questionText = (q.question || "").toLowerCase();



    return (

      title.includes(searchLower) ||

      description.includes(searchLower) ||

      questionText.includes(searchLower)

    );

  });

  // ------------------------ Render ------------------------

  return (

    <>

      {/* ---------- EXISTING UI (unchanged layout) ---------- */}

      <section className="bg-white shadow rounded-lg overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200">

          <h2 className="text-2xl font-bold text-gray-900">

            Coding Exams & Questions

          </h2>

        </div>



        {/* TABS: Exams & Questions */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsList className="grid w-full grid-cols-2 bg-gray-100">

            <TabsTrigger value="exams" className="text-lg font-semibold">

              Exams List

            </TabsTrigger>

            <TabsTrigger value="questions" className="text-lg font-semibold">

              Questions Bank ({codingQuestions.length})

            </TabsTrigger>

          </TabsList>



          {/* EXAMS TAB */}

          {/* EXAMS TAB - With Search Filter */}

          <TabsContent value="exams" className="p-6">

            <div className="flex flex-col gap-6">

              {/* Header: Title + Search + Action Buttons */}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <h3 className="text-lg font-medium">All Exams</h3>



                {/* Search Input + Button + Action Buttons */}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

                  {/* Search Bar */}

                  <div className="flex items-center gap-2">

                    <Input

                      type="text"

                      placeholder="Search by exam title..."

                      value={searchTerm}

                      onChange={(e) => setSearchTerm(e.target.value)}

                      className="w-full sm:w-64"

                    />

                    {/* <Button

                      variant="outline"

                      size="icon"

                      onClick={() => {

                        // Optional: you can trigger a refetch if needed

                        // Currently filters instantly on typing

                      }}

                    >

                      <svg

                        xmlns="http://www.w3.org/2000/svg"

                        className="h-5 w-5"

                        fill="none"

                        viewBox="0 0 24 24"

                        stroke="currentColor"

                      >

                        <path

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          strokeWidth={2}

                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"

                        />

                      </svg>

                    </Button> */}

                  </div>



                  {/* Action Buttons */}

                  <div className="flex gap-3">

                    <Button onClick={() => setIsBulkDialogOpen(true)}>

                      Bulk Upload

                    </Button>

                    <Button onClick={() => setIsIndividualDialogOpen(true)}>

                      Add Question

                    </Button>

                    <Button

                      onClick={() => {

                        setIsEditExamMode(false);

                        setEditingExam(null);

                        setIsCreateExamOpen(true);

                      }}

                      className="bg-indigo-600"

                    >

                      Create Exam

                    </Button>

                  </div>

                </div>

              </div>



              {/* Table */}

              <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        ID

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Title

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Description

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Window Start

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Window End

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Duration (Min)

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Actions

                      </th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {filteredExams.length === 0 ? (

                      <tr>

                        <td

                          colSpan={7}

                          className="px-6 py-12 text-center text-gray-500"

                        >

                          {searchTerm

                            ? "No exams match your search."

                            : "No exams created yet."}

                        </td>

                      </tr>

                    ) : (

                      filteredExams.map((exam) => (

                        <tr key={exam.id}>

                          <td className="px-6 py-4 text-sm">{exam.id}</td>

                          <td className="px-6 py-4 font-medium">

                            {exam.title}

                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">

                            {exam.description}

                          </td>

                          <td className="px-6 py-4 text-sm">

                            {exam.window_start?.slice(0, 16).replace("T", ",  ")}

                          </td>

                          <td className="px-6 py-4 text-sm">

                            {exam.window_end?.slice(0, 16).replace("T", ",  ")}

                          </td>

                          <td className="px-6 py-4 text-sm">

                            {exam.duration_minutes} min

                          </td>

                          <td className="px-6 py-4 text-sm">

                            <button

                              onClick={() => handleEditExam(exam)}

                              className="text-indigo-600 hover:underline mr-4"

                            >

                              Edit

                            </button>

                            <button

                              onClick={() => handleDeleteExam(exam.id)}

                              className="text-red-600 hover:underline"

                            >

                              Delete

                            </button>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </TabsContent>



          {/* QUESTIONS TAB - DELETE BUTTON ALWAYS VISIBLE */}

          <TabsContent value="questions" className="p-6">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-lg font-medium">Coding Questions Bank</h3>

              {/* <Button onClick={() => setIsIndividualDialogOpen(true)} className="bg-green-600 hover:bg-green-700">

      + Add New Question

    </Button> */}

            </div>



            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {codingQuestions.length === 0 ? (

                <div className="col-span-full text-center py-16 text-gray-500">

                  No coding questions found. Add one!

                </div>

              ) : (

                codingQuestions.map((q) => {

                  const questionId = q.id ?? q.question_id;



                  return (

                    <div

                      key={questionId}

                      className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"

                    >

                      {/* Question Info */}

                      <div>

                        <h4 className="font-bold text-indigo-700 text-lg leading-tight">

                          {q.title || "Untitled Question"}

                        </h4>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">

                          {q.description || "No description available"}

                        </p>



                        <div className="mt-4 space-y-2 text-xs">

                          <div className="flex items-center justify-between">

                            <span className="text-gray-500 font-medium">

                              ID:

                            </span>

                            <span className="font-mono bg-gray-100 px-3 py-1 rounded-md text-gray-700">

                              {questionId}

                            </span>

                          </div>

                          <div className="flex items-center justify-between">

                            <span className="text-gray-500 font-medium">

                              Test Cases:

                            </span>

                            <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full">

                              {q.test_cases?.length || 0}

                            </span>

                          </div>

                        </div>

                      </div>



                      {/* Delete Button - Always Visible */}

                      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">

                        <Button

                          variant="outline"

                          className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"

                          onClick={() => handleOpenEditQuestion(q)}

                        >

                          Edit

                        </Button>



                        <Button

                          variant="destructive"

                          size="sm"

                          className="w-1/2 font-semibold shadow-md hover:shadow-lg"

                          onClick={async () => {

                            if (!window.confirm(`Delete Question ID: ${questionId} permanently?`))

                              return;



                            const token2 = localStorage.getItem("adminToken");

                            try {

                              await axios.delete(

                                "https://api.devtalent.securxperts.com:8000/compiler-questions/delete",

                                {

                                  params: { question_id: questionId },

                                  headers: { Authorization: `Bearer ${token2}` },

                                }

                              );



                              toast.success(`Question ID: ${questionId} deleted successfully`);

                              fetchCodingQuestions();

                            } catch (error) {

                              console.error(error);



                              const message = axios.isAxiosError(error)

                                ? error.response?.data?.message || "Update failed"

                                : "Update failed";



                              toast.error(message);

                            }



                          }}

                        >

                          Delete

                        </Button>

                      </div>



                    </div>

                  );

                })

              )}

            </div>

          </TabsContent>

        </Tabs>

      </section>



      {/* ---------- BULK UPLOAD DIALOG ---------- */}

      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>

        <DialogContent className="sm:max-w-md max-h-[70vh] flex flex-col">

          <DialogHeader className="flex-shrink-0">

            <DialogTitle className="text-2xl font-bold text-center">

              Bulk Upload Questions

            </DialogTitle>

            {/* <DialogDescription className="text-center">Select exam and upload MCQs file</DialogDescription> */}

          </DialogHeader>



          <div className="flex-1 overflow-y-auto px-1">

            <form onSubmit={handleBulkSubmit} className="space-y-6 pb-4">

              <div>

                <Label>

                  Coding File <span className="text-red-500">*</span>

                </Label>



                <div className="flex items-center h-12 rounded-xl border border-gray-300 px-3 bg-white">

                  <label

                    htmlFor="bulk-file"

                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"

                  >

                    Browse...

                  </label>



                  <input

                    id="bulk-file"

                    type="file"

                    accept=".csv,.json"

                    onChange={handleBulkFileChange}

                    className="hidden"

                  />

                </div>

                {bulkFileName && (
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-sm text-green-600">
                      Selected file: <span className="font-medium">{bulkFileName}</span>
                    </p>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-600 text-sm font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}



              </div>



              <Button type="submit" className="w-full h-12 bg-indigo-600">

                Upload Bulk Questions

              </Button>

            </form>

          </div>

        </DialogContent>

      </Dialog>



      {/* ---------- INDIVIDUAL CODING QUESTION DIALOG ---------- */}

      <Dialog

        open={isIndividualDialogOpen}

        onOpenChange={setIsIndividualDialogOpen}

      >

        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">

          <DialogHeader className="flex-shrink-0">

            <DialogTitle className="text-2xl font-bold text-center">

              Add Coding Question

            </DialogTitle>

            <DialogDescription className="text-center">

              Enter coding question details

            </DialogDescription>

          </DialogHeader>



          <div className="flex-1 overflow-y-auto px-1">

            <form onSubmit={handleIndividualSubmit} className="space-y-6 pb-4">

              <div>

                <Label>

                  Title<span className="text-red-600">*</span>

                </Label>

                <Input

                  type="text"

                  value={questionTitle}

                  onChange={(e) => setQuestionTitle(e.target.value)}

                  maxLength={30}

                  required

                  placeholder="Enter title"

                />

              </div>



              <div>

                <Label>

                  Question<span className="text-red-600">*</span>

                </Label>

                <Input

                  type="text"

                  value={questionText}

                  onChange={(e) => setQuestionText(e.target.value)}

                  maxLength={200}

                  required

                  placeholder="Enter question"

                />

              </div>



              <div>

                <Label>

                  Description<span className="text-red-600">*</span>

                </Label>

                <Input

                  type="text"

                  value={description}

                  onChange={(e) => setDescription(e.target.value)}

                  maxLength={200}

                  required

                  placeholder="Enter description"

                />

              </div>



              <div>

                <Label>

                  Sample Inputs<span className="text-red-600">*</span>

                </Label>

                <Input

                  type="text"

                  value={sampleInputs}

                  onChange={(e) => setSampleInputs(e.target.value)}

                  maxLength={200}

                  required

                  placeholder="Enter sample inputs"

                />

              </div>



              <div>

                <Label>

                  Sample Outputs<span className="text-red-600">*</span>

                </Label>

                <Input

                  type="text"

                  value={sampleOutputs}

                  onChange={(e) => setSampleOutputs(e.target.value)}

                  maxLength={200}

                  required

                  placeholder="Enter sample outputs"

                />

              </div>



              {/* Testcases */}

              <div>

                <Label>

                  Test Cases<span className="text-red-600">*</span>

                </Label>



                <div className="space-y-3">

                  {testCases.map((tc, index) => (

                    <div

                      key={index}

                      className="border p-3 rounded-lg space-y-2"

                    >

                      <div className="flex justify-between">

                        <span className="font-semibold">Testcase {index}</span>

                        <Button

                          type="button"

                          variant="destructive"

                          onClick={() => removeTestCase(index)}

                          className="h-8 px-3"

                        >

                          Remove

                        </Button>

                      </div>



                      <Input

                        placeholder="Input"

                        value={tc.input}

                        onChange={(e) =>

                          updateTestCase(index, "input", e.target.value)

                        }

                        required

                        maxLength={200}

                      />



                      <Input

                        placeholder="Output"

                        value={tc.output}

                        onChange={(e) =>

                          updateTestCase(index, "output", e.target.value)

                        }

                        required

                        maxLength={200}

                      />

                    </div>

                  ))}



                  <Button

                    type="button"

                    variant="outline"

                    onClick={addTestCase}

                    className="w-full"

                  >

                    + Add Test Case

                  </Button>

                </div>

              </div>



              <Button type="submit" className="w-full h-12 bg-indigo-600">

                Add Question

              </Button>

            </form>

          </div>

        </DialogContent>

      </Dialog>



      {/* ---------- EDIT CODING QUESTION DIALOG ---------- */}

      <Dialog open={isEditQuestionOpen} onOpenChange={setIsEditQuestionOpen}>

        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">

          <DialogHeader className="flex-shrink-0">

            <DialogTitle className="text-2xl font-bold text-center">

              Edit Coding Question

            </DialogTitle>

            <DialogDescription className="text-center">

              Update coding question details

            </DialogDescription>

          </DialogHeader>



          <div className="flex-1 overflow-y-auto px-1">

            <form onSubmit={handleUpdateQuestion} className="space-y-6 pb-4">

              <div>

                <Label>Title<span className="text-red-600">*</span></Label>

                <Input

                  type="text"

                  value={questionTitle}

                  onChange={(e) => setQuestionTitle(e.target.value)}

                  maxLength={30}

                  required

                />

              </div>



              <div>

                <Label>Question<span className="text-red-600">*</span></Label>

                <Input

                  type="text"

                  value={questionText}

                  onChange={(e) => setQuestionText(e.target.value)}

                  maxLength={200}

                  required

                />

              </div>



              <div>

                <Label>Description<span className="text-red-600">*</span></Label>

                <Input

                  type="text"

                  value={description}

                  onChange={(e) => setDescription(e.target.value)}

                  maxLength={200}

                  required

                />

              </div>



              <div>

                <Label>Sample Inputs<span className="text-red-600">*</span></Label>

                <Input

                  type="text"

                  value={sampleInputs}

                  onChange={(e) => setSampleInputs(e.target.value)}

                  maxLength={200}

                  required

                />

              </div>



              <div>

                <Label>Sample Outputs<span className="text-red-600">*</span></Label>

                <Input

                  type="text"

                  value={sampleOutputs}

                  onChange={(e) => setSampleOutputs(e.target.value)}

                  maxLength={200}

                  required

                />

              </div>



              {/* Testcases */}

              <div>

                <Label>Test Cases<span className="text-red-600">*</span></Label>



                <div className="space-y-3">

                  {testCases.map((tc, index) => (

                    <div key={index} className="border p-3 rounded-lg space-y-2">

                      <div className="flex justify-between">

                        <span className="font-semibold">Testcase {index}</span>

                        <Button

                          type="button"

                          variant="destructive"

                          onClick={() => removeTestCase(index)}

                          className="h-8 px-3"

                        >

                          Remove

                        </Button>

                      </div>



                      <Input

                        placeholder="Input"

                        value={tc.input}

                        onChange={(e) =>

                          updateTestCase(index, "input", e.target.value)

                        }

                        required

                        maxLength={200}

                      />



                      <Input

                        placeholder="Output"

                        value={tc.output}

                        onChange={(e) =>

                          updateTestCase(index, "output", e.target.value)

                        }

                        required

                        maxLength={200}

                      />

                    </div>

                  ))}



                  <Button

                    type="button"

                    variant="outline"

                    onClick={addTestCase}

                    className="w-full"

                  >

                    + Add Test Case

                  </Button>

                </div>

              </div>



              <Button type="submit" className="w-full h-12 bg-blue-600">

                Update Question

              </Button>

            </form>

          </div>

        </DialogContent>

      </Dialog>





      <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>

        <DialogContent className="sm:max-w-xl max-h-[80vh] flex flex-col">

          <DialogHeader className="text-left">

            <DialogTitle className="text-2xl">

              {isEditExamMode ? "Edit Exam" : "Create New Exam"}

            </DialogTitle>

            <DialogDescription>

              {isEditExamMode ? "Update exam details" : "Enter exam details"}

            </DialogDescription>

          </DialogHeader>



          <div className="flex-1 overflow-y-auto p-4">

            <form onSubmit={handleCreateExamSubmit} className="space-y-5">

              {/* Title - Required */}

              <div>

                <Label>

                  Title <span className="text-red-500">*</span>

                </Label>

                <Input

                  value={examData.title}

                  maxLength={30}

                  onChange={(e) =>

                    setExamData({ ...examData, title: e.target.value })

                  }

                  required

                  placeholder="Enter exam title"

                />

              </div>



              {/* College Selection - Only Active Colleges + Required */}

              <div>

                <Label>

                  Assign to College <span className="text-red-500">*</span>

                </Label>

                <Select

                  value={selectedExamCollegeName}

                  onValueChange={(value) => {

                    setSelectedExamCollegeName(value);

                    const college = activeColleges.find(

                      (c) => c.name === value,

                    );

                    if (college) setSelectedCollegeId(college.id);

                  }}

                  required

                >

                  <SelectTrigger className="h-12">

                    <SelectValue placeholder="Select a college" />

                  </SelectTrigger>

                  <SelectContent>

                    {activeColleges.length === 0 ? (

                      <SelectItem value="none" disabled>

                        No active colleges available

                      </SelectItem>

                    ) : (

                      activeColleges.map((college) => (

                        <SelectItem key={college.id} value={college.name}>

                          {college.name}

                        </SelectItem>

                      ))

                    )}

                  </SelectContent>

                </Select>

                {activeColleges.length === 0 && (

                  <p className="text-xs text-amber-600 mt-1">

                    No active colleges found. Expired colleges are hidden.

                  </p>

                )}

              </div>



              {/* Description - Optional */}

              <div>

                <Label>Description</Label>

                <Input

                  value={examData.description}

                  maxLength={200}

                  onChange={(e) =>

                    setExamData({ ...examData, description: e.target.value })

                  }

                  placeholder="Optional description"

                />

              </div>



              {/* Category - Now Required */}

              <div>

                <Label>

                  Category <span className="text-red-500">*</span>

                </Label>

                <Input

                  type="text"

                  value={examData.category}

                  maxLength={30}

                  onChange={(e) =>

                    setExamData({ ...examData, category: e.target.value })

                  }

                  placeholder="Technical"

                  required

                />

              </div>



              {/* DateTime Fields - Required */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <Label>

                    Window Start <span className="text-red-500">*</span>

                  </Label>

                  <Input

                    type="datetime-local"

                    value={examData.window_start}

                    onChange={(e) =>

                      setExamData({ ...examData, window_start: e.target.value })

                    }

                    required

                    min={getCurrentDateTime()}

                  />

                </div>

                <div>

                  <Label>

                    Window End <span className="text-red-500">*</span>

                  </Label>

                  <Input

                    type="datetime-local"

                    value={examData.window_end}

                    onChange={(e) =>

                      setExamData({ ...examData, window_end: e.target.value })

                    }

                    required

                    min={examData.window_start || getCurrentDateTime()}

                  />

                </div>

              </div>



              {/* Duration - Required */}

              <div>

                <Label>

                  Duration (minutes) <span className="text-red-500">*</span>

                </Label>

                <Input

                  type="number"

                  min="1"

                  value={examData.duration_minutes}

                  maxLength={30}

                  onChange={(e) =>

                    setExamData({

                      ...examData,

                      duration_minutes: parseInt(e.target.value) || 30,

                    })

                  }

                  required

                />

              </div>



              <div className="flex items-center space-x-2">

                <Checkbox

                  checked={examData.is_active}

                  onCheckedChange={(v) =>

                    setExamData({ ...examData, is_active: v })

                  }

                />

                <Label>Is Active</Label>

              </div>



              {/* Questions Section - Required (at least one) */}

              <div>

                <Label>

                  Questions for this Exam{" "}

                  <span className="text-red-500">*</span>

                </Label>

                <div className="space-y-3 mt-2">

                  {selectedCodingQuestions.length === 0 && (

                    <div className="text-sm text-red-600 italic">

                      At least one question is required.

                    </div>

                  )}

                  {selectedCodingQuestions.map((sq, idx) => (

                    <div

                      key={sq.question_id}

                      className="border p-3 rounded-lg flex justify-between items-center"

                    >

                      <div>

                        <div className="font-medium">

                          {getQuestionLabel(sq.questionObj)}

                        </div>

                        <div className="text-xs text-gray-500">

                          ID: {sq.question_id}

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <Input

                          type="number"

                          value={sq.score}

                          onChange={(e) =>

                            updateQuestionScore(idx, e.target.value)

                          }

                          className="w-20"

                          placeholder="Score"

                          min="1"

                          required

                        />

                        <Button

                          type="button"

                          variant="destructive"

                          size="sm"

                          onClick={() => removeQuestion(idx)}

                        >

                          Remove

                        </Button>

                      </div>

                    </div>

                  ))}

                  <Button

                    type="button"

                    variant="outline"

                    onClick={addNewQuestion}

                    className="w-full"

                  >

                    + Add Question

                  </Button>

                </div>

              </div>



              <Button

                type="submit"

                size="lg"

                className="w-full bg-indigo-600 hover:bg-indigo-700"

                disabled={selectedCodingQuestions.length === 0}

              >

                {isEditExamMode ? "Update Exam" : "Create Exam"}

              </Button>

            </form>

          </div>

        </DialogContent>

      </Dialog>



      {/* ---------- QUESTION SELECT + SCORE DIALOG ---------- */}

      <Dialog

        open={isQuestionDialogOpen}

        onOpenChange={setIsQuestionDialogOpen}

      >

        <DialogContent className="sm:max-w-xl max-h-[70vh] flex flex-col">

          <DialogHeader>

            <DialogTitle>Select Question</DialogTitle>

            <DialogDescription>

              Choose a coding question and assign a score

            </DialogDescription>

          </DialogHeader>



          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Select question */}

            <div>

              <Label>Choose Question</Label>



              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">

                {codingQuestions.length === 0 && (

                  <div className="text-sm text-gray-500">

                    No questions available

                  </div>

                )}



                {codingQuestions.map((q) => {

                  // NORMALIZE id for consistent behavior

                  const questionId =

                    q.id ?? q.question_id ?? q.questionId ?? null;

                  const isSelected =

                    selectedQuestionToAdd &&

                    selectedQuestionToAdd.id === questionId;



                  return (

                    <div

                      key={String(questionId) || Math.random()}

                      className={`p-3 border rounded cursor-pointer transition ${isSelected ? "ring-2 ring-indigo-600 bg-indigo-50" : ""}`}

                      onClick={() => {

                        // store selected question with normalized id for later comparisons

                        setSelectedQuestionToAdd({ ...q, id: questionId });

                        setSelectedQuestionScore("");

                      }}

                    >

                      <div className="font-medium">{q.title || q.question}</div>

                      <div className="text-xs text-gray-500">

                        {q.description || "No description"}

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>



            {/* Score input */}

            <div>

              <Label>Score</Label>

              <Input

                type="number"

                value={selectedQuestionScore}

                onChange={(e) => setSelectedQuestionScore(e.target.value)}

                placeholder="Enter score"

                disabled={!selectedQuestionToAdd}

              />

            </div>



            {/* Buttons */}

            <div className="flex justify-end space-x-2">

              <Button

                type="button"

                variant="ghost"

                onClick={() => {

                  setIsQuestionDialogOpen(false);

                  setSelectedQuestionToAdd(null);

                  setSelectedQuestionScore("");

                }}

              >

                Cancel

              </Button>



              <Button

                type="button"

                disabled={!selectedQuestionToAdd}

                onClick={() => {

                  if (!selectedQuestionToAdd) {

                    toast.error("Please select a question");

                    return;

                  }



                  if (

                    !selectedQuestionScore ||

                    isNaN(Number(selectedQuestionScore))

                  ) {

                    toast.error("Please enter a valid score");

                    return;

                  }



                  // Prevent duplicates (compare normalized .id)

                  const exists = selectedCodingQuestions.some(

                    (item) =>

                      String(item.question_id) ===

                      String(selectedQuestionToAdd.id),

                  );

                  if (exists) {

                    toast.error("Question already added to this exam");

                    return;

                  }



                  setSelectedCodingQuestions((prev) => [

                    ...prev,

                    {

                      question_id: selectedQuestionToAdd.id,

                      score: Number(selectedQuestionScore),

                      questionObj: selectedQuestionToAdd,

                    },

                  ]);



                  toast.success("Question added successfully");



                  // Reset dialog

                  setIsQuestionDialogOpen(false);

                  setSelectedQuestionToAdd(null);

                  setSelectedQuestionScore("");

                }}

              >

                Add to Exam

              </Button>

            </div>

          </div>

        </DialogContent>

      </Dialog>

    </>

  );

}

