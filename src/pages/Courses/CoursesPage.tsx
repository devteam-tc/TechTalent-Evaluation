import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseItem } from "../Exams/types";

const API_BASE_URL = '/api';

// API Types
interface ApiCourseType {
  id: number;
  name: string;
  is_active?: boolean;
}

interface ApiCourse {
  id: number;
  name: string;
  type_id: number;
  description?: string;
  status?: string;
  available_exams?: number;
  total_exams?: number;
  active_exams?: number;
}

const 
CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseTypes, setCourseTypes] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token
  const getAuthToken = () => {
    const possibleKeys = ['token', 'access_token', 'auth_token', 'jwt', 'userToken', 'adminToken'];
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) return token;
    }
    return null;
  };

  // Fetch course types and courses
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found. Please login.');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch course types first
        console.log('Fetching course types...');
        const typesResponse = await fetch(`${API_BASE_URL}/admin/catalog/course-types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        let typesMap: Record<number, string> = {};
        if (typesResponse.ok) {
          const typesData: ApiCourseType[] = await typesResponse.json();
          console.log('Course types received:', typesData);
          typesMap = typesData.reduce((acc, type) => {
            acc[type.id] = type.name;
            return acc;
          }, {} as Record<number, string>);
          setCourseTypes(typesMap);
        } else {
          console.error('Failed to fetch course types:', typesResponse.status);
        }

        // Fetch courses
        console.log('Fetching courses...');
        const coursesResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (coursesResponse.ok) {
          const coursesData: ApiCourse[] = await coursesResponse.json();
          console.log('Courses received:', coursesData);
          
          // Map API data to CourseItem format
          const mappedCourses: CourseItem[] = coursesData.map(course => ({
            id: course.id,
            name: course.name,
            type: typesMap[course.type_id] || 'Unknown',
            availableExams: course.available_exams || 0,
            totalExams: course.total_exams || 0,
            activeExams: course.active_exams || 0,
            totalStudents: 0,
            exams: []
          }));
          
          setCourses(mappedCourses);
        } else {
          const errorText = await coursesResponse.text();
          console.error('Failed to fetch courses:', coursesResponse.status, errorText);
          setError(`Failed to fetch courses: ${coursesResponse.status}`);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || 
        (statusFilter === "Active" && course.activeExams > 0) ||
        (statusFilter === "Inactive" && course.activeExams === 0);
      
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  const handleCreateCourse = () => {
    // Navigate to create course page
    navigate('/courses/create');
  };

  const handleEditCourse = (courseId: number) => {
    // Navigate to edit course page
    navigate(`/courses/edit/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      // API call to delete course would go here
      // await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      //   method: 'DELETE'
      // });
      
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#1f2937] mb-2">
            Course Management
          </h1>
          <p className="text-[14px] text-[#6b7280]">
            Create and manage all Exams on the platform
          </p>
        </div>

        {/* Search, Filter, and Create Button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search exams by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-2 pl-10 pr-4 text-[14px] focus:border-[#5865f2] focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-[8px] border border-[#e1e3ea] bg-white py-2 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none appearance-none"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Create New Course Button */}
          <button
            onClick={handleCreateCourse}
            className="flex h-[44px] items-center gap-2 rounded-[12px] px-6 text-[14px] font-medium text-white shadow-lg transition-all hover:shadow-xl"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              boxShadow: "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
            }}
          >
            <Plus size={16} />
            Create New Course
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-12 text-center">
            <div className="text-[#6b7280]">Loading courses...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-[16px] border border-red-200 bg-red-50 p-6 mb-6">
            <div className="text-[14px] text-red-600 font-medium">{error}</div>
          </div>
        )}

        {/* Courses Table - Hidden during loading */}
        {!isLoading && (
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f9fc]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#374151] uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#374151] uppercase tracking-wider">
                      Course Type
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#374151] uppercase tracking-wider">
                      Total Exams
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#374151] uppercase tracking-wider">
                      Active Exams
                    </th>
                    <th className="px-6 py-4 text-right text-[12px] font-semibold text-[#374151] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3ea]">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-[#6b7280]">
                        {courses.length === 0 ? 'No courses found. Create a new course to get started.' : 'No courses found matching your search criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-[#f8f9fc] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-[#1f2937]">
                                {course.name}
                              </div>
                              <div className="text-[12px] text-[#6b7280]">
                                {course.availableExams} exams available
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[14px] text-[#1f2937]">
                            {course.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[14px] text-[#1f2937]">
                            {course.totalExams}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#dcfce7] text-[#166534]">
                            {course.activeExams} Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEditCourse(course.id)}
                              className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                              title="Edit Course"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
