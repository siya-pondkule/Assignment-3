import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Adjust import path as needed

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  user: any = null;
  marks: any = {};  // Initialize marks as an empty object
  hasData: boolean = false;  // Initialize hasData as false

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserFromLocalStorage();
    this.loadMarksData();
  }

  loadUserFromLocalStorage() {
    const user = localStorage.getItem('user'); // Get user object from localStorage
    if (user) {
      this.user = JSON.parse(user); // Parse and store the user object
      console.log('Student email:', this.user.email); // Check if the email is being correctly retrieved
    } else {
      console.log('No valid user in localStorage');
      this.router.navigate(['/login']); // Redirect to login if no user is found
    }
  }

  loadMarksData() {
    if (this.user && this.user.email) {
      const email = this.user.email;
      console.log('Fetching marks for email:', email); // Log the email being sent
      this.authService.getStudentMarks(email).subscribe(
        (marks: any) => {
          this.marks = marks;
          this.hasData = true; // If marks are fetched successfully
        },
        (error: any) => {  // Fix the implicit any error by defining the error type
          console.error('Error fetching marks:', error);
          this.hasData = false; // Set hasData to false if there's an error
        }
      );
    }
  }
}
