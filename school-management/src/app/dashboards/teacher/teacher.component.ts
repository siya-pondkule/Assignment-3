import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { User } from '../../user.model'; // Ensure this path is correct based on your project structure

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html'
})
export class TeacherComponent implements OnInit {
  students: User[] = [];
  selectedStudentId: string | null = null;
  selectedStudentEmail: string = '';
  showMarksForm = false;

  marks = {
    subject1: 0,
    subject2: 0,
    subject3: 0,
    subject4: 0,
    subject5: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.authService.getStudents().subscribe(
      (data: User[]) => this.students = data,
      (error: any) => console.error('Error loading students:', error)
    );
  }

  openMarksForm(student: User) {
    this.selectedStudentId = student.id;
    this.selectedStudentEmail = student.email;
    this.showMarksForm = true;
    this.marks = {
      subject1: 0,
      subject2: 0,
      subject3: 0,
      subject4: 0,
      subject5: 0
    };
  }

  submitMarks() {
    if (!this.selectedStudentId || !this.selectedStudentEmail) return;

    const data = {
      student_id: this.selectedStudentId,
      email: this.selectedStudentEmail,
      ...this.marks
    };

    this.authService.addMarks(data).subscribe(
      (res: any) => {
        alert('Marks submitted successfully!');
        this.showMarksForm = false;
      },
      (error: any) => {
        console.error('Error submitting marks:', error);
        alert('Failed to submit marks');
      }
    );
  }
}
