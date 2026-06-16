// src/lib/api.ts
// Centralized API helper for student data

export const BASE_URL = "http://192.168.0.125:8000";

/**
 * Student list item as returned by GET /student/students
 */
export interface Student {
  id: number;
  full_name: string;
  email_id: string;
  college_name: string;
  phone_number: string;
  registered_date: string; // ISO string
  status?: string; // optional if not provided
  // Additional fields may be added by backend
}

/**
 * Detailed student information returned by GET /student/students/{id}
 */
export interface StudentDetails extends Student {
  avg?: number; // average score (optional)
  mcq_total?: number;
  coding_total?: number;
  selected_courses: {
    course_id: number;
    course_name: string;
  }[];
}

/**
 * Fetch the list of registered students.
 */
export async function fetchStudents(): Promise<Student[]> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students`, {
    method: "GET",
    headers,
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.status}`);
  }
  const data = (await response.json()) as Student[];
  return data;
}

/**
 * Fetch detailed information for a single student by ID.
 */
export async function fetchStudentById(id: number): Promise<StudentDetails> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students/${id}`, {
    method: "GET",
    headers,
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch student ${id}: ${response.status}`);
  }
  const data = (await response.json()) as StudentDetails;
  return data;
}

/**
 * Delete a student by ID.
 */
export async function deleteStudent(id: number): Promise<void> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete student ${id}: ${response.status}`);
  }
}
