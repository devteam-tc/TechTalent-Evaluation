import React, { useState, useEffect } from "react";
import { ArrowLeft, X, FileText, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseItem } from "./types";

const API_BASE_URL = 'http://192.168.0.154:9000';

const EditCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [form, setForm] = useState({
    courseName: "",
    courseType: "Technical",
    description: "",
    status: "Active"
  });

  const courseTypes = [
    "Technical",
    "Business",
    "Creative",
    "Language",
    "Science",
    "Mathematics",
    "Other"
  ];

  const statusOptions = [
    { value: "Active", label: "Active", description: "Course is available for enrollment" },
    { value: "Draft", label: "Draft", description: "Course is not yet published" },
    { value: "Inactive", label: "Inactive", description: "Course is temporarily unavailable" }
  ];

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        // For now, using mock data - replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        // const courseData = await response.json();
        
        // Mock data - replace with actual API response
        const mockCourseData: CourseItem = {
          id: parseInt(courseId),
          name: "Computer Science",
          type: "Technical",
          availableExams: 3,
          totalExams: 3,
          activeExams: 1,
          totalStudents: 145,
          exams: []
        };
        
        setForm({
          courseName: mockCourseData.name,
          courseType: mockCourseData.type,
          description: "", // This would come from API
          status: "Active" // This would come from API
        });
      } catch (error) {
        console.error('Error fetching course data:', error);
        alert('Failed to load course data');
        navigate('/courses');
      } finally {
        setIsFetching(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    setIsLoading(true);
    
    try {
      // API call to update course
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
        body: JSON.stringify({
          name: form.courseName.trim(),
          type: form.courseType,
          description: form.description.trim(),
          status: form.status,
          // Add other required fields
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Course updated successfully:', result);
        
        // Navigate back to courses page
        navigate('/courses');
        
        // Show success message (you could use a toast notification here)
        alert('Course updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update course'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  const descriptionLength = form.description.length;
  const maxDescriptionLength = 500;

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#f3f2fb] flex items-center justify-center">
        <div className="text-[#6b7280]">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e3ea] bg-white text-[#6b7280] transition-colors hover:bg-[#f8f9fc] hover:text-[#5865f2]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#1f2937]">
              Edit Course
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Update course information
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Information Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0ff]">
                  <BookOpen className="h-5 w-5 text-[#5865f2]" />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1f2937]">
                  Course Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* Course Name */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.courseName}
                    onChange={(e) => handleInputChange('courseName', e.target.value)}
                    placeholder="e.g., Computer Science, Digital Marketing"
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                    required
                  />
                </div>

                {/* Course Type */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Course Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.courseType}
                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                    required
                  >
                    {courseTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Select the category that best describes this course
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Description (Optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a brief description of the course content and objectives..."
                    rows={4}
                    maxLength={maxDescriptionLength}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] resize-none"
                  />
                  <div className="mt-1 flex justify-between">
                    <p className="text-[12px] text-[#6b7280]">
                      Brief overview of what students will learn
                    </p>
                    <p className="text-[12px] text-[#6b7280]">
                      {descriptionLength}/{maxDescriptionLength} characters
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Set the course status. Only active courses are visible to students
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-6 text-[14px] font-medium text-[#6b7280] transition-colors hover:bg-[#f8f9fc]"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !form.courseName.trim()}
                className="flex items-center justify-center gap-2 rounded-[8px] py-3 px-6 text-[14px] font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                  boxShadow: "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
                }}
              >
                <FileText size={16} />
                {isLoading ? 'Updating...' : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;