

import React, { useState, useEffect, Key, useRef } from "react";
import jsPDF from "jspdf";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Eye, EyeOff } from "lucide-react";

interface Student {
  user_name: Key;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  year: string;
  college: string;
  state: string;
  city: string;
  created: string | null;
  passedout_year?: string;
  interest?: "technical" | "nontechnical" | string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  window_start: string;
  window_end: string;
  duration_minutes: number;
  subjects?: string[];
  category?: string;
  is_active?: boolean;
  college_name?: string;
}

interface Breakdown {
  subject: string;
  correct: number;
  total: number;
  percent: number;
}

interface Result {
  attemptId: number;
  studentId: number;
  studentName: string;
  examId: string;
  exam_title: string;
  score: number;
  total: number;
  percentage: number;
  startedAt: string;
  submittedAt: string;
  breakdown: Breakdown[];
  isShortlisted: boolean;
}

interface College {
  id: number;
  name: string;
  passkey: string;
  passkey_expires_at: string;
  is_active?: boolean;
}

interface ContactStudent {
  id: number;
  name: string;
  qualification: string;
  passedout_year: string;
  college: string;
  purpose: string;
  phone: string;
  email: string;
  year?: string;
}

interface ContactCollege {
  id: number;
  name: string;
  location: string;
  contact: string;
  email: string;
  designation: string;
  poc_name: string;
}

interface ContactRecruiter {
  id: number;
  company_name: string;
  designation: string;
  poc_name: string;
  phone: string;
  email: string;
  using_platform: string;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [isCollegeDialogOpen, setIsCollegeDialogOpen] = useState(false);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isEditExamMode, setIsEditExamMode] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeData, setCollegeData] = useState({
    name: "",
    passkey: "",
    passkey_expires_at: "",
  });
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    window_start: "",
    window_end: "",
    duration_minutes: 30,
    subjects: [""] as string[],
    category: "",
    is_active: true,
  });
  const [selectedExamCollegeName, setSelectedExamCollegeName] =
    useState<string>("");
  const [bulkExamId, setBulkExamId] = useState<string>("");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFileName, setBulkFileName] = useState<string>("");
  const previousBulkFileRef = useRef<File | null>(null);
  const [individualExamId, setIndividualExamId] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [individualOptions, setIndividualOptions] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [contactStudents, setContactStudents] = useState<ContactStudent[]>([]);
  const [contactColleges, setContactColleges] = useState<ContactCollege[]>([]);
  const [contactRecruiters, setContactRecruiters] = useState<
    ContactRecruiter[]
  >([]);
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(collegeSearchQuery.toLowerCase()),
  );
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.college.toLowerCase().includes(studentSearchQuery.toLowerCase()),
  );
  const [codingResults, setCodingResults] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedResultCollege, setSelectedResultCollege] =
    useState<string>("");
  const [showPasskey, setShowPasskey] = useState(false);

  useEffect(() => {
    if (isIndividualDialogOpen) {
      setSubjectName("");
      setQuestionText("");
      setIndividualOptions(["", "", "", ""]);
      setSelectedCorrectIndex("");
    }
  }, [isIndividualDialogOpen]);

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchColleges();
    fetchContactStudents();
    fetchContactColleges();
    fetchContactRecruiters();
  }, []);

  useEffect(() => {
    if (activeSection === 3) {
      fetchResults();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 6) {
      fetchCodingResults();
    }
  }, [activeSection]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/exam/admin/exams",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      } else {
        toast.error("Failed to fetch exams");
      }
    } catch (error) {
      toast.error("Network error fetching exams");
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/admin/registrations",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        const processedData = Array.isArray(data) ? data.map((student: any) => ({
          ...student,
          interest: student.interest || student.interest_type || student.stream || ""
        })) : [];
        setStudents(processedData);
      } else {
        toast.error("Failed to fetch students");
      }
    } catch (error) {
      toast.error("Network error fetching students");
    }
  };

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/admin/colleges",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      } else {
        toast.error("Failed to fetch colleges");
      }
    } catch (error) {
      toast.error("Network error fetching colleges");
    }
  };

  const fetchContactStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/contact/admin/students?limit=100&offset=0",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        const processedData = Array.isArray(data) ? data.map((item: any) => ({
          ...item,
          passedout_year: item.passedout_year || item.year || ""
        })) : [];
        setContactStudents(processedData);
      } else {
        toast.error("Failed to fetch contact students");
      }
    } catch (error) {
      toast.error("Network error fetching contact students");
    }
  };

  const fetchContactColleges = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/contact/admin/colleges?limit=100&offset=0",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setContactColleges(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to fetch contact colleges");
      }
    } catch (error) {
      toast.error("Network error fetching contact colleges");
    }
  };

  const fetchContactRecruiters = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/contact/admin/recruiters?limit=100&offset=0",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setContactRecruiters(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to fetch contact recruiters");
      }
    } catch (error) {
      toast.error("Network error fetching contact recruiters");
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/admin/results",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch results");
      const rawData = await response.json();
      const attempts = rawData.results || rawData || [];

      const processed: Result[] = attempts.map((a: any) => {
        const student = students.find((s) => s.user_id === a.user_id);
        const breakdown: Breakdown[] = a.breakdown || [];

        // Safely calculate score and total from breakdown
        const score = breakdown.reduce(
          (sum: number, b: Breakdown) => sum + (b.correct || 0),
          0,
        );
        const total = breakdown.reduce(
          (sum: number, b: Breakdown) => sum + (b.total || 0),
          0,
        );

        // Use backend-provided values if available, fallback to calculated
        const finalScore = a.score ?? score;
        const finalTotal = a.total ?? (total > 0 ? total : 1);
        const percentage =
          finalTotal > 0
            ? Math.round((finalScore / finalTotal) * 100)
            : a.percentage || a.percent || 0;

        const isShortlisted =
          breakdown.length > 0
            ? breakdown.every((b: any) => (b.percent || 0) >= 60)
            : percentage >= 60;

        return {
          attemptId: a.attempt_id || a.result_id || a.id,
          studentId: a.user_id,
          studentName: student?.name || a.user_name || "Unknown Student",
          examId: a.exam_id || a.examId,
          exam_title: a.exam_title,
          score: finalScore,
          total: finalTotal,
          percentage,
          startedAt: a.started_at || "",
          submittedAt:
            a.submitted_at || a.submittedAt || new Date().toISOString(),
          breakdown,
          isShortlisted,
        };
      });

      setResults(processed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student results");
      setResults([]);
    }
  };

  const fetchCodingResults = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/compiler-questions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch coding results");
      }
      const data = await response.json();
      const items = data.results || data || [];

      const normalized = items.map((item: any) => {
        // Extract percentage from the scores array (API structure)
        const firstScore = item.scores?.[0];
        const percentage = firstScore?.percentage ?? 0;

        return {
          id: item.id || item.attempt_id,
          candidate_name: item.candidate_name || item.student_name || "Unknown",
          candidate_id: item.candidate_id || item.user_id || "-",
          college_name: item.college_name || item.college || "-",
          exam_id: item.exam_id || "-",
          total_marks: item.total_marks ?? item.score ?? 0,
          percentage: percentage,
          status: percentage >= 60 ? "Passed" : "Failed",
        };
      });

      setCodingResults(normalized);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load coding results");
      setCodingResults([]);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Results", 14, 20);
    let y = 30;
    results.forEach((result, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(
        `${index + 1}. ${result.studentName} | Score: ${result.score}/${result.total} | ${result.percentage}% | ${result.isShortlisted ? "Shortlisted" : "Not Shortlisted"}`,
        14,
        y,
      );
      y += 7;
    });
    doc.save("student_results.pdf");
    toast.success("PDF downloaded successfully!");
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const formatInterest = (student: any) => {
    const interest =
      student.interest ||
      student.interest_type ||
      student.stream ||
      student.category ||
      student.preference ||
      student.tech_interest;   // try all likely keys

    if (!interest || interest === "") return "Not Specified";

    const normalized = String(interest).toLowerCase().trim();

    if (normalized.includes("tech")) return "Technical";
    if (normalized.includes("non")) return "Non-Technical";

    return interest;
  };



  const resetExamForm = () => {
    setExamData({
      title: "",
      description: "",
      window_start: "",
      window_end: "",
      duration_minutes: 30,
      subjects: [""],
      category: "",
      is_active: true,
    });
    setSelectedExamCollegeName("");
    setIsEditExamMode(false);
    setEditingExam(null);
  };

  const handleCreateExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingFields: string[] = [];
    if (!selectedExamCollegeName) missingFields.push("College");
    if (!examData.title.trim()) missingFields.push("Title");
    if (!examData.window_start) missingFields.push("Start Time");
    if (!examData.window_end) missingFields.push("End Time");
    if (examData.duration_minutes <= 0) missingFields.push("Duration");
    if (!examData.category) missingFields.push("Category");
    if (examData.subjects.filter((s) => s.trim()).length === 0)
      missingFields.push("Subjects");
    if (missingFields.length > 0) {
      toast.error(
        `Please fill all required fields: ${missingFields.join(", ")}`,
      );
      return;
    }
    const subjects = examData.subjects.map((s) => s.trim()).filter((s) => s);
    if (subjects.length === 0) {
      toast.error("Please add at least one valid subject!");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const url = isEditExamMode
        ? `https://api.devtalent.securxperts.com:8000/admin/exams/${editingExam?.id}`
        : "https://api.devtalent.securxperts.com:8000/admin/exams";
      const payload: any = {
        title: examData.title.trim(),
        description: examData.description.trim() || "",
        window_start: new Date(examData.window_start).toISOString(),
        window_end: new Date(examData.window_end).toISOString(),
        duration_minutes: parseInt(examData.duration_minutes.toString()),
        is_active: examData.is_active ?? true,
        subjects: subjects,
        category: examData.category,
        college_name: selectedExamCollegeName,
      };
      const response = await fetch(url, {
        method: isEditExamMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(
          isEditExamMode
            ? "Exam updated successfully!"
            : "Exam created successfully!",
        );
        setIsCreateExamOpen(false);
        resetExamForm();
        fetchExams();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.detail || err.message || "Failed to save exam");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleEditExam = (exam: Exam) => {
    setIsEditExamMode(true);
    setEditingExam(exam);
    setSelectedExamCollegeName(exam.college_name || "");
    const formatDateForInput = (dateStr: string) => {
      return new Date(dateStr).toISOString().slice(0, 16);
    };
    setExamData({
      title: exam.title || "",
      description: exam.description || "",
      window_start: formatDateForInput(exam.window_start),
      window_end: formatDateForInput(exam.window_end),
      duration_minutes: exam.duration_minutes || 30,
      subjects:
        exam.subjects && exam.subjects.length > 0 ? exam.subjects : [""],
      category: exam.category || "",
      is_active: exam.is_active ?? true,
    });
    setIsCreateExamOpen(true);
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://api.devtalent.securxperts.com:8000/admin/exams/${examId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        toast.success("Exam deleted successfully!");
        fetchExams();
      } else {
        toast.error("Failed to delete exam.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkExamId) {
      toast.error("Please select an exam!");
      return;
    }
    if (!bulkFile) {
      toast.error("Please select a file to upload!");
      return;
    }
    if (
      previousBulkFileRef.current &&
      bulkFile.name === previousBulkFileRef.current.name &&
      bulkFile.size === previousBulkFileRef.current.size &&
      bulkFile.lastModified === previousBulkFileRef.current.lastModified
    ) {
      toast.warning(
        "You have already uploaded this file. Please choose a different one or proceed.",
      );
    }
    const formData = new FormData();
    formData.append("file", bulkFile);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://api.devtalent.securxperts.com:8000/admin/exams/${bulkExamId}/questions/bulk?skip_invalid=true`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      if (response.ok) {
        const result = await response.json();
        toast.success(
          result.message || "Bulk questions uploaded successfully!",
        );
        previousBulkFileRef.current = bulkFile;
        setIsBulkDialogOpen(false);
        setBulkExamId("");
        setBulkFile(null);
        setBulkFileName("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.detail || errorData.message || "Upload failed.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !individualExamId ||
      !questionText.trim() ||
      individualOptions.filter((o) => o.trim()).length < 2 ||
      selectedCorrectIndex === "" ||
      !subjectName.trim()
    ) {
      toast.error("Please fill all fields correctly!");
      return;
    }
    try {
      const options = individualOptions
        .filter((o) => o.trim())
        .map((o) => ({ text: o.trim() }));
      const correctIndex = parseInt(selectedCorrectIndex);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://api.devtalent.securxperts.com:8000/admin/exams/${individualExamId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: questionText.trim(),
            options: options,
            correct_index: correctIndex,
            subject_name: subjectName.trim(),
          }),
        },
      );
      if (response.ok) {
        toast.success("Question added successfully!");
        setIsIndividualDialogOpen(false);
        setIndividualExamId("");
        setQuestionText("");
        setIndividualOptions(["", "", "", ""]);
        setSelectedCorrectIndex("");
        setSubjectName("");
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.detail || "Failed to add question.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = collegeData.name.trim();
    const trimmedPasskey = collegeData.passkey.trim();
    if (!trimmedName || !trimmedPasskey || !collegeData.passkey_expires_at) {
      toast.error("Please fill all fields!");
      return;
    }
    const selectedDate = new Date(collegeData.passkey_expires_at);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < now) {
      toast.error(
        "Expiry date cannot be in the past! Please select today or a future date.",
      );
      return;
    }
    try {
      const expiresAt = new Date(collegeData.passkey_expires_at).toISOString();
      const token = localStorage.getItem("adminToken");
      const url =
        isEditMode && editingCollege
          ? `https://api.devtalent.securxperts.com:8000/admin/colleges/${editingCollege.id}`
          : "https://api.devtalent.securxperts.com:8000/admin/colleges";
      const method = isEditMode ? "PUT" : "POST";
      const body = JSON.stringify({
        name: trimmedName,
        passkey: trimmedPasskey,
        passkey_expires_at: expiresAt,
        ...(isEditMode && { is_active: true }),
      });
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (response.ok) {
        const successMsg = isEditMode
          ? "College updated successfully!"
          : "College added successfully!";
        toast.success(successMsg);
        setIsCollegeDialogOpen(false);
        setCollegeData({ name: "", passkey: "", passkey_expires_at: "" });
        setIsEditMode(false);
        setEditingCollege(null);
        fetchColleges();
      } else {
        toast.error(
          `Failed to ${isEditMode ? "update" : "add"} college. Please try again.`,
        );
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const handleDeleteStudent = async (userId: number) => {
    if (!confirm("Delete this student?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://api.devtalent.securxperts.com:8000/admin/users/${userId}?hard=true`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        toast.success("Student deleted!");
        fetchStudents();
      } else {
        toast.error("Failed to delete student.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleEditCollege = (college: College) => {
    setIsEditMode(true);
    setEditingCollege(college);
    setCollegeData({
      name: college.name,
      passkey: college.passkey,
      passkey_expires_at: new Date(college.passkey_expires_at)
        .toISOString()
        .slice(0, 16),
    });
    setIsCollegeDialogOpen(true);
  };

  const [isRefreshingResults, setIsRefreshingResults] = useState(false);

  const handleRefreshResults = async () => {
    setIsRefreshingResults(true);
    try {
      await fetchResults();
      toast.success("Results refreshed");
    } finally {
      setIsRefreshingResults(false);
    }
  };

  const handleDeleteCollege = async (id: number) => {
    if (!confirm("Delete this college?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://api.devtalent.securxperts.com:8000/admin/colleges/${id}?hard=true`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        toast.success("College deleted!");
        fetchColleges();
      } else {
        toast.error("Failed to delete college.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleAddSubject = () => {
    setExamData({ ...examData, subjects: [...examData.subjects, ""] });
  };

  const handleSubjectChange = (index: number, value: string) => {
    const updated = [...examData.subjects];
    updated[index] = value;
    setExamData({ ...examData, subjects: updated });
  };

  const handleRemoveSubject = (index: number) => {
    if (examData.subjects.length > 1) {
      setExamData({
        ...examData,
        subjects: examData.subjects.filter((_, i) => i !== index),
      });
    }
  };

  const navigate = useNavigate();

  const sectionTabs = [
    { id: 1, label: "Registered Students" },
    { id: 2, label: "Exams" },
    { id: 3, label: "MCQ Results" },
    { id: 6, label: "Coding Results" },
    { id: 4, label: "Colleges" },
    { id: 5, label: "Contacts" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage students, exams, and results for colleges.
            </p>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section 1: Registered Students */}
        {activeSection === 1 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Students List
              </h2>
            </div>
            <div className="px-6 py-3">
              <Input
                type="text"
                placeholder="Search by name, email, or college..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YOP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center py-16 text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.qualification}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.college}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.passedout_year || student.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${String(
                              student.interest ||
                              // student.interest_type ||
                              // student.stream ||
                              // student.category ||
                              // student.preference ||
                              // student.tech_interest ||
                              ""
                            )
                              .toLowerCase()
                              .includes("tech")
                              ? "bg-green-100 text-green-800"
                              : String(
                                student.interest ||
                                // student.interest_type ||
                                // student.stream ||
                                // student.category ||
                                // student.preference ||
                                // student.tech_interest ||
                                ""
                              )
                                .toLowerCase()
                                .includes("non")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {formatInterest(student)}
                          </span>


                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteStudent(student.user_id)}
                            className="text-red-600 hover:text-red-900"
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
          </section>
        )}

        {/* Section 2: Exams */}
        {activeSection === 2 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Exams List (MCQ)</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <select
                    className="block w-64 pl-3 pr-8 py-2 text-base border border-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCollege || ""}
                    onChange={(e) => setSelectedCollege(e.target.value || null)}
                  >
                    <option value="">All Colleges</option>
                    {Array.from(new Set(exams.map((exam) => exam.college_name)))
                      .sort()
                      .map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => navigate("/coddingExam")}>
                    Create Coding Exam
                  </Button>
                  <Button onClick={() => setIsBulkDialogOpen(true)}>
                    Bulk Upload Questions
                  </Button>
                  <Button onClick={() => setIsIndividualDialogOpen(true)}>
                    Add Individual Question
                  </Button>
                  <Button
                    onClick={() => {
                      resetExamForm();
                      setIsCreateExamOpen(true);
                    }}
                  >
                    Create Exam
                  </Button>
                </div>
              </div>
            </div>
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
                      College Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Window Start
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Window End
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration (min)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exams
                    .filter(
                      (exam) =>
                        !selectedCollege ||
                        exam.college_name === selectedCollege,
                    )
                    .map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.college_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.window_start.replace("T", ", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.window_end.replace("T", ", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {exam.duration_minutes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditExam(exam)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section 3: Student Results */}
        {activeSection === 3 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">MCQ Exam Performance</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <select
                    className="block w-64 pl-3 pr-8 py-2 text-base border border-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedResultCollege}
                    onChange={(e) => setSelectedResultCollege(e.target.value)}
                  >
                    <option value="">All Colleges</option>
                    {Array.from(
                      new Set(
                        exams.map((exam) => exam.college_name).filter(Boolean),
                      ),
                    )
                      .sort()
                      .map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                  </select>
                </div>
                <Button
                  onClick={handleRefreshResults}
                  variant="outline"
                  disabled={isRefreshingResults}
                >
                  {isRefreshingResults ? "Refreshing..." : "Refresh"}
                </Button>

                <Button onClick={downloadPDF} variant="outline">
                  Download PDF
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-16 text-gray-500"
                      >
                        No results available yet
                      </td>
                    </tr>
                  ) : (
                    results
                      .filter((result) => {
                        if (!selectedResultCollege) return true;
                        const exam = exams.find((e) => e.id === result.examId);
                        return exam?.college_name === selectedResultCollege;
                      })
                      .map((result) => {
                        const exam = exams.find((e) => e.id === result.examId);
                        return (
                          <tr
                            key={result.attemptId}
                            className={
                              result.isShortlisted
                                ? "bg-green-50"
                                : "hover:bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 text-sm font-medium">
                              {result.studentId}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              {result.studentName}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {result.examId}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {result.exam_title}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {exam?.college_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              {result.score} / {result.total}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                              {result.percentage}%
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${result.isShortlisted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {result.isShortlisted
                                  ? "Shortlisted"
                                  : "Not Shortlisted"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(result.submittedAt).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Section 6: Coding Results */}
        {activeSection === 6 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Coding Exam Performance
                </h2>
                {/* <p className="text-sm text-gray-600 mt-1">
                  All candidate submissions and results from coding assessments. 
                </p> */}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleRefreshResults}
                  variant="outline"
                  disabled={isRefreshingResults}
                >
                  {isRefreshingResults ? "Refreshing..." : "Refresh"}
                </Button>

                <Button
                  onClick={() => {
                    const tableElement = document.querySelector(
                      "#coding-results-table",
                    );
                    if (!tableElement) return;
                    html2canvas(tableElement as HTMLElement, { scale: 2 }).then(
                      (canvas) => {
                        const imgData = canvas.toDataURL("image/png");
                        const pdf = new jsPDF("l", "mm", "a4");
                        const imgWidth = pdf.internal.pageSize.getWidth() - 20;
                        const imgHeight =
                          (canvas.height * imgWidth) / canvas.width;
                        pdf.addImage(
                          imgData,
                          "PNG",
                          10,
                          10,
                          imgWidth,
                          imgHeight,
                        );
                        pdf.save("coding-results.pdf");
                      },
                    );
                  }}
                  variant="outline"
                >
                  Download PDF
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table
                id="coding-results-table"
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam ID
                    </th>  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Title
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College Name
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codingResults.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-16 text-gray-500"
                      >
                        No coding attempts found. Click "Refresh" if data should
                        be available.
                      </td>
                    </tr>
                  ) : (
                    codingResults.map((item: any, index) => {
                      const percentage = item.percentage || 0;
                      const isPassed = item.percentage > 40;
                      return (
                        <tr
                          key={item.id || item.attempt_id || index}
                          className={
                            isPassed
                              ? "bg-green-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 text-sm">
                            {item.candidate_id || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.candidate_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.exam_id || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.exam_title || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.college_name || "-"}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {item.total_marks || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <span
                              className={
                                isPassed ? "text-green-600" : "text-orange-600"
                              }
                            >
                              {Math.round(item.percentage)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${isPassed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {isPassed ? "Shortlisted" : "Not Shortlisted"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.submited_at || "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Section 4: College List */}
        {activeSection === 4 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                College List
              </h2>
              <Button
                onClick={() => {
                  setIsEditMode(false);
                  setEditingCollege(null);
                  setCollegeData({
                    name: "",
                    passkey: "",
                    passkey_expires_at: "",
                  });
                  setIsCollegeDialogOpen(true);
                }}
              >
                Add College
              </Button>
            </div>
            <div className="px-6 py-4 border-b border-gray-200">
              <Input
                type="text"
                placeholder="Search colleges by name..."
                value={collegeSearchQuery}
                onChange={(e) => setCollegeSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="overflow-x-auto">
              {filteredColleges.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  {colleges.length === 0 ? (
                    <p className="text-xl font-medium">Add your 1st college</p>
                  ) : (
                    <p>No colleges found matching your search.</p>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredColleges.map((college) => {
                      const isExpired =
                        new Date(college.passkey_expires_at) < new Date();
                      return (
                        <tr
                          key={college.id}
                          className={` ${isExpired ? "bg-red-50" : ""}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {college.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {college.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(
                              college.passkey_expires_at,
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                            >
                              {isExpired ? "Inactive" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditCollege(college)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCollege(college.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Section 5: Contacts */}
        {activeSection === 5 && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Student Requests
              </h2>
              <div className="space-y-12">
                {/* Student Contacts */}
                <div className="overflow-x-auto border border-blue-600 rounded-lg">
                  <table className="min-w-full divide-y divide-blue-600">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Qualification
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          YOP
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          College
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Phone
                        </th>

                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {contactStudents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No student contacts yet
                          </td>
                        </tr>
                      ) : (
                        contactStudents.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {contact.id}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {contact.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                              {contact.email}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {contact.qualification}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {contact.passedout_year}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {contact.college}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {contact.purpose}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {contact.phone}
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* College Contacts */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    College Contacts
                  </h2>
                  <div className="overflow-x-auto border border-red-600 rounded-lg">
                    <table className="w-full table-fixed divide-y divide-red-600">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-[4rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="w-[14rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="w-[18rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="w-[12rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="w-[10rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Email
                          </th>

                          <th className="w-[12rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Designation
                          </th>
                          <th className="w-[14rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            POC Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contactColleges.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              No college contacts yet
                            </td>
                          </tr>
                        ) : (
                          contactColleges.map((contact) => (
                            <tr
                              key={contact.id}
                              className="hover:bg-gray-50 align-top"
                            >
                              <td className="w-[4rem] px-6 py-4 text-sm text-gray-900 break-words">
                                {contact.id}
                              </td>
                              <td className="w-[14rem] px-6 py-4 text-sm font-medium text-gray-900 break-words">
                                {contact.name}
                              </td>
                              <td className="w-[18rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.email}
                              </td>
                              <td className="w-[12rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.location}
                              </td>
                              <td className="w-[10rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.contact}
                              </td>

                              <td className="w-[12rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.designation}
                              </td>
                              <td className="w-[14rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.poc_name}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recruiter Contacts */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Recruiter Contacts
                  </h2>
                  <div className="overflow-x-auto border border-green-600 rounded-lg">
                    <table className="w-full table-fixed divide-y divide-green-600">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-[4rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="w-[16rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="w-[12rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone No
                          </th>
                          <th className="w-[18rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="w-[12rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Designation
                          </th>
                          <th className="w-[14rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            POC Name
                          </th>

                          <th className="w-[14rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Using Platform
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contactRecruiters.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              No recruiter contacts yet
                            </td>
                          </tr>
                        ) : (
                          contactRecruiters.map((contact) => (
                            <tr
                              key={contact.id}
                              className="hover:bg-gray-50 align-top"
                            >
                              <td className="w-[4rem] px-6 py-4 text-sm text-gray-900 break-words">
                                {contact.id}
                              </td>
                              <td className="w-[16rem] px-6 py-4 text-sm font-medium text-gray-900 break-words">
                                {contact.company_name}
                              </td>
                              <td className="w-[12rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.phone}
                              </td>
                              <td className="w-[18rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.email}
                              </td>
                              <td className="w-[12rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.designation}
                              </td>
                              <td className="w-[14rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.poc_name}
                              </td>

                              <td className="w-[14rem] px-6 py-4 text-sm text-gray-600 break-words">
                                {contact.using_platform}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Dialogs remain unchanged - same as original */}
        {/* College Dialog */}
        <Dialog
          open={isCollegeDialogOpen}
          onOpenChange={setIsCollegeDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {isEditMode ? "Edit College" : "Add New College"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {isEditMode
                  ? "Update college details"
                  : "Enter college details to create a new entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCollegeSubmit} className="space-y-6">
              <div>
                <Label htmlFor="college-name" className="text-sm font-medium">
                  College Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="college-name"
                  value={collegeData.name}
                  maxLength={30}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, name: e.target.value })
                  }
                  required
                  placeholder="Enter college name"
                  className="h-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="college-passkey"
                  className="text-sm font-medium"
                >
                  Passkey <span className="text-red-600">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="college-passkey"
                    type={showPasskey ? "text" : "password"}
                    value={collegeData.passkey}
                    maxLength={30}
                    onChange={(e) =>
                      setCollegeData({
                        ...collegeData,
                        passkey: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter passkey"
                    className="h-12 pr-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    tabIndex={-1}
                  >
                    {showPasskey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="college-expires-at"
                  className="text-sm font-medium"
                >
                  Passkey Expires At <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="college-expires-at"
                  type="datetime-local"
                  value={collegeData.passkey_expires_at}
                  onChange={(e) =>
                    setCollegeData({
                      ...collegeData,
                      passkey_expires_at: e.target.value,
                    })
                  }
                  min={getCurrentDateTime()}
                  required
                  className="h-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only today and future dates allowed
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                {isEditMode ? "Update College" : "Add College"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Exam Dialog */}
        <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>
          <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {isEditExamMode ? "Edit Exam" : "Create New Exam"}
              </DialogTitle>
              <DialogDescription className="text-center">
                This exam will be assigned to one specific college
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateExamSubmit} className="space-y-5 mt-6">
              <div>
                <Label className="text-sm font-medium">
                  Assign to College <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={selectedExamCollegeName}
                  onValueChange={setSelectedExamCollegeName}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a college (required)" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges
                      .filter(
                        (college) =>
                          new Date(college.passkey_expires_at) >= new Date(),
                      )
                      .map((college) => (
                        <SelectItem key={college.id} value={college.name}>
                          {college.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedExamCollegeName && (
                  <p className="text-xs text-green-600 mt-1">
                    Exam will be visible only to students from:{" "}
                    <strong>{selectedExamCollegeName}</strong>
                  </p>
                )}
              </div>
              <div>
                <Label>
                  Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  value={examData.title}
                  maxLength={30}
                  onChange={(e) =>
                    setExamData({ ...examData, title: e.target.value })
                  }
                  placeholder="e.g. Campus Drive 2025 - Round 1"
                  required
                />
              </div>
              <div>
                <Label>
                  Category <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={examData.category}
                  onValueChange={(value) =>
                    setExamData({ ...examData, category: value })
                  }
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="nontechnical">Non-Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Input
                  value={examData.description}
                  maxLength={200}
                  onChange={(e) =>
                    setExamData({ ...examData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    Start Time <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    maxLength={30}
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
                    End Time <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    maxLength={30}
                    value={examData.window_end}
                    onChange={(e) =>
                      setExamData({ ...examData, window_end: e.target.value })
                    }
                    required
                    min={getCurrentDateTime()}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Duration (minutes) <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="number"
                  min="10"
                  maxLength={30}
                  value={examData.duration_minutes}
                  onChange={(e) =>
                    setExamData({
                      ...examData,
                      duration_minutes: parseInt(e.target.value) || 30,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="active"
                  checked={examData.is_active}
                  onCheckedChange={(checked) =>
                    setExamData({ ...examData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="active">Exam is Active</Label>
              </div>
              <div>
                <Label>
                  Subjects <span className="text-red-600">*</span>
                </Label>
                {examData.subjects.map((sub, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <Input
                      value={sub}
                      maxLength={30}
                      onChange={(e) => handleSubjectChange(i, e.target.value)}
                      placeholder={`Subject ${i + 1}`}
                    />

                    {i > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveSubject(i)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={handleAddSubject}
                >
                  + Add Subject
                </Button>
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-medium">
                {isEditExamMode ? "Update Exam" : "Create Exam"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog
          open={isBulkDialogOpen}
          onOpenChange={(open) => {
            setIsBulkDialogOpen(open);
            if (!open) {
              setBulkExamId("");
              setBulkFile(null);
              setBulkFileName("");
              previousBulkFileRef.current = null;
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Upload Questions</DialogTitle>
              <DialogDescription>
                Upload an Excel/CSV file with questions for the selected exam.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div>
                <Label>Select Exam</Label>
                <Select
                  value={bulkExamId}
                  onValueChange={(value) => {
                    setBulkExamId(value);
                    // Reset file upload when exam changes
                    setBulkFile(null);
                    setBulkFileName("");
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No exams available
                      </SelectItem>
                    ) : (
                      exams.map((exam) => (
                        <SelectItem key={exam.id} value={String(exam.id)}>
                          {exam.title} (ID: {exam.id})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Upload File</Label>
                <div className="mt-2">
                  <Input
                    key={bulkExamId} // Force re-render when exam changes
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setBulkFile(file);
                      setBulkFileName(file ? file.name : "");
                    }}
                    required
                    className="
  block w-full text-sm text-gray-500 
  h-12
  file:mr-4 file:py-2 file:px-4 
  file:rounded-full file:border-0 
  file:text-sm file:font-semibold 
  file:bg-indigo-50 file:text-indigo-700 
  hover:file:bg-indigo-100
"
                  />
                  {bulkFileName && (
                    <p className="mt-3 text-sm text-green-600">
                      Selected file:{" "}
                      <span className="font-medium">{bulkFileName}</span>
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Upload Questions
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Individual Question Dialog */}
        <Dialog
          open={isIndividualDialogOpen}
          onOpenChange={setIsIndividualDialogOpen}
        >
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Individual Question</DialogTitle>
              <DialogDescription>
                Add a single MCQ question to an exam.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleIndividualSubmit} className="space-y-4">
              <div>
                <Label>Select Exam</Label>
                <Select
                  value={individualExamId}
                  onValueChange={setIndividualExamId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={String(exam.id)}>
                        {exam.title} (ID: {exam.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Java, Python, Aptitude"
                  required
                />
              </div>
              <div>
                <Label>Question Text</Label>
                <Input
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question"
                  required
                />
              </div>
              <div>
                <Label>Options (4 required)</Label>
                {individualOptions.map((opt, idx) => (
                  <Input
                    key={idx}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...individualOptions];
                      newOpts[idx] = e.target.value;
                      setIndividualOptions(newOpts);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="mt-2"
                  />
                ))}
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Select
                  value={selectedCorrectIndex}
                  onValueChange={setSelectedCorrectIndex}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Option 1</SelectItem>
                    <SelectItem value="1">Option 2</SelectItem>
                    <SelectItem value="2">Option 3</SelectItem>
                    <SelectItem value="3">Option 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Question
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
