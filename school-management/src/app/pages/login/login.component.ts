import { Component } from '@angular/core';
import { AuthService } from '../../auth.service'; // Adjust import path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' }; // Define the user object
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginUser() {
    this.authService.login(this.user).subscribe(
      (response: any) => {
        console.log('Login Response:', response); // Add this line
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('user', JSON.stringify(response.user));
        const role = response.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'teacher') {
          this.router.navigate(['/teacher-dashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/student-dashboard']);
        }
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
  
}
