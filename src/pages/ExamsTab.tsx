import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Calendar, Clock, BookOpen } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string;
  window_start: string;
  window_end: string;
  duration_minutes: number;
  subjects: string[];
  category: 'technical' | 'nontechnical';
  is_active: boolean;
  college_name: string;
}

interface College {
  id: number;
  name: string;
  passkey_expires_at: string;
  is_active?: boolean;
}

const ExamsTab = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    window_start: "",
    window_end: "",
    duration_minutes: 60,
    category: "technical" as 'technical' | 'nontechnical',
    is_active: true,
    college_name: "",
    subjects: [""] as string[],
  });

  const token = localStorage.getItem("adminToken");




  const fetchColleges = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://api.devtalent.securxperts.com:8000/admin/colleges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setColleges(data || []);
      }
    } catch (err) {
      console.error("Failed to load colleges", err);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchColleges();
  }, []);


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      window_start: getCurrentDateTime(),
      window_end: getFutureDateTime(2),
      duration_minutes: 60,
      category: "technical",
      is_active: true,
      college_name: "",
      subjects: [""],
    });
    setIsEditMode(false);
    setEditingExam(null);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getFutureDateTime = (hours: number) => {
    const future = new Date();
    future.setHours(future.getHours() + hours);
    future.setMinutes(future.getMinutes() - future.getTimezoneOffset());
    return future.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const addSubject = () => {
    setFormData(prev => ({ ...prev, subjects: [...prev.subjects, ""] }));
  };

  const removeSubject = (index: number) => {
    if (formData.subjects.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const openEditExam = (exam: Exam) => {
    setIsEditMode(true);
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || "",
      window_start: new Date(exam.window_start).toISOString().slice(0, 16),
      window_end: new Date(exam.window_end).toISOString().slice(0, 16),
      duration_minutes: exam.duration_minutes,
      category: exam.category as 'technical' | 'nontechnical',
      is_active: exam.is_active ?? true,
      college_name: exam.college_name || "",
      subjects: exam.subjects?.length ? exam.subjects : [""],
    });
    setIsCreateOpen(true);
  };


    const fetchExams = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.devtalent.securxperts.com:8000/exam/admin/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load exams");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSubjects = formData.subjects
      .map(s => s.trim())
      .filter(Boolean);

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.college_name) return toast.error("Please select a college");
    if (trimmedSubjects.length === 0) return toast.error("Add at least one subject");
    if (!formData.window_start || !formData.window_end) return toast.error("Time window is required");
    if (new Date(formData.window_end) <= new Date(formData.window_start)) {
      return toast.error("End time must be after start time");
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      window_start: new Date(formData.window_start).toISOString(),
      window_end: new Date(formData.window_end).toISOString(),
      duration_minutes: Number(formData.duration_minutes),
      category: formData.category,
      is_active: formData.is_active,
      college_name: formData.college_name,
      subjects: trimmedSubjects,
    };

    const url = isEditMode
      ? `https://api.devtalent.securxperts.com:8000/admin/exams/${editingExam?.id}`
      : "https://api.devtalent.securxperts.com:8000/admin/exams";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save exam");
      }

      toast.success(isEditMode ? "Exam updated!" : "Exam created!");
      setIsCreateOpen(false);
      resetForm();
      fetchExams();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!window.confirm("Delete this exam permanently?")) return;

    try {
      const res = await fetch(`https://api.devtalent.securxperts.com:8000/admin/exams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Exam deleted");
      fetchExams();
    } catch (err) {
      toast.error("Could not delete exam");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exams Management</h2>
          <p className="text-gray-600 mt-1">Create, edit and manage placement / assessment exams</p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
        >
          <Plus size={18} />
          Create New Exam
        </Button>
      </div>

      {/* Exam List */}
      <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No exams found. Create your first exam.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">College</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                        {exam.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{exam.college_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        exam.category === 'technical'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {exam.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {exam.duration_minutes} min
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        exam.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {exam.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openEditExam(exam)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <Pencil size={18} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 size={18} className="inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Exam Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isEditMode ? 'Edit Exam' : 'Create New Exam'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the existing exam details"
                : "Set up a new assessment / placement exam"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveExam} className="space-y-6 mt-6">
            {/* College Selection */}
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <BookOpen size={18} />
                Assign to College <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.college_name}
                onValueChange={(val) => setFormData(prev => ({ ...prev, college_name: val }))}
                required
              >
                <SelectTrigger className="h-11 mt-1.5">
                  <SelectValue placeholder="Select target college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges
                    .filter(c => new Date(c.passkey_expires_at) >= new Date())
                    .map(college => (
                      <SelectItem key={college.id} value={college.name}>
                        {college.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-base font-medium">Exam Title <span className="text-red-600">*</span></Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Campus Recruitment Drive 2025 - Round 1"
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium">Category <span className="text-red-600">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(val: 'technical' | 'nontechnical') =>
                    setFormData(prev => ({ ...prev, category: val }))
                  }
                >
                  <SelectTrigger className="h-11 mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="nontechnical">Non-Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Window */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  Start Time <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  name="window_start"
                  value={formData.window_start}
                  onChange={handleInputChange}
                  min={getCurrentDateTime()}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  End Time <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  name="window_end"
                  value={formData.window_end}
                  onChange={handleInputChange}
                  min={formData.window_start || getCurrentDateTime()}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Clock size={16} />
                  Duration (min) <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  min={10}
                  className="mt-1.5 h-11"
                  required
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-medium">Subjects <span className="text-red-600">*</span></Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  className="gap-1"
                >
                  <Plus size={16} /> Add Subject
                </Button>
              </div>

              <div className="space-y-3">
                {formData.subjects.map((subject, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <Input
                      value={subject}
                      onChange={(e) => handleSubjectChange(idx, e.target.value)}
                      placeholder={`Subject ${idx + 1} (e.g. Aptitude, Java, DBMS)`}
                      className="flex-1 h-11"
                    />
                    {formData.subjects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubject(idx)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Active */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-base font-medium">Description (optional)</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description or instructions..."
                  className="mt-1.5 h-11"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, is_active: !!checked }))
                  }
                />
                <Label htmlFor="is_active" className="text-base font-medium cursor-pointer">
                  Exam is Active (visible to students)
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditMode ? 'Update Exam' : 'Create Exam'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamsTab;

