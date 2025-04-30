import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service'; // Adjust import path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: string = 'student'; // Default active tab
  students: any[] = [];
  teachers: any[] = [];

  constructor(private adminService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch all students and teachers on component initialization
    this.getStudents();
    this.getTeachers();
  }

  // Fetch students
  getStudents() {
    this.adminService.getStudents().subscribe((students: any[]) => {
      this.students = students;
    });
  }

  // Fetch teachers
  getTeachers() {
    this.adminService.getTeachers().subscribe((teachers: any[]) => {
      this.teachers = teachers;
    });
  }

  // Delete student
  deleteStudent(studentId: string) {
    this.adminService.deleteStudent(studentId).subscribe(() => {
      this.getStudents(); // Refresh student list
    });
  }

  // Delete teacher
  deleteTeacher(teacherId: string) {
    this.adminService.deleteTeacher(teacherId).subscribe(() => {
      this.getTeachers(); // Refresh teacher list
    });
  }

  // Switch active tab
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  // Update student (Dummy method, implement as needed)
  updateStudent(studentId: string) {
    // Navigate to update page or open a modal to update the student info
    this.router.navigate([`/update-student/${studentId}`]);
  }

  // Update teacher (Dummy method, implement as needed)
  updateTeacher(teacherId: string) {
    // Navigate to update page or open a modal to update the teacher info
    this.router.navigate([`/update-teacher/${teacherId}`]);
  }
}
