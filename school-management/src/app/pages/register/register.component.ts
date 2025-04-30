import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'student' // default role
  };

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:3000/register', this.user).subscribe(
      (res: any) => {
        alert(res.message || 'Registration successful!');
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error(err);
        alert('Registration failed!');
      }
    );
  }
}
