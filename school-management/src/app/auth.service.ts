// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 
import { map } from 'rxjs/operators'; 
import { jwtDecode } from 'jwt-decode';
import { User, ApiResponse } from './user.model'; // Import the User interface

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000'; // Backend URL

  constructor(private http: HttpClient, private router: Router) {}

  // Register a new user
  register(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, user);
  }

  // Login the user and store the token and role
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, user).pipe(
      tap((response: any) => {
        // Save the JWT token and user role to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role); // Store role directly
      })
    );
  }

  // Decode the JWT token and extract the role
  getRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const decoded: any = jwtDecode(token); // Decoding the JWT token
    return decoded.role; // Return the decoded role
  }

  // Check if the user is logged in (i.e., token exists)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Logout the user by removing token and role from localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Admin-related methods for managing students and teachers

  // Get all users (students and teachers)
  getUsers(): Observable<{ students: User[], teachers: User[] }> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}/admin/users`).pipe(
      map(response => {
        const students = response.users.filter(user => user.role === 'student');
        const teachers = response.users.filter(user => user.role === 'teacher');
        return { students, teachers }; // Return both arrays separately
      })
    );
  }

  // Get all students
  getStudents(): Observable<User[]> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}/admin/users`).pipe(
      map(response => response.users.filter(user => user.role === 'student'))
    );
  }

  // Get all teachers
  getTeachers(): Observable<User[]> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}/admin/users`).pipe(
      map(response => response.users.filter(user => user.role === 'teacher'))
    );
  }

  // Delete a student by ID
  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/admin/user/${studentId}`);
  }

  // Delete a teacher by ID
  deleteTeacher(teacherId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/admin/user/${teacherId}`);
  }

  // Update student details (name, email, role)
  updateStudent(studentId: string, studentData: User): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/admin/user/${studentId}`, studentData);
  }

  // Update teacher details (name, email, role)
  updateTeacher(teacherId: string, teacherData: User): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/admin/user/${teacherId}`, teacherData);
  }

  
  addMarks(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/add-marks`, data);
  }

  getStudentMarks(email: string) {
    console.log('Sending request for email:', email); // Confirm email sent
    return this.http.get(`${this.BASE_URL}/student-marks/${email}`);
  }
  
  
}
