import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  login() {
    this.authService.login(this.loginData).subscribe(
      response => {
        // Store the token and user information using AuthService
        this.authService.setTokenAndUser(response.token, response.user);
        
        // Check if the user is logged in
        if (this.authService.isLoggedIn()) {
          // Redirect to the profile page
          this.router.navigate(['/profile']);
        } else {
          // Handle the case where the token or user information is not set
          console.error('Token or user information not set');
        }
      },
      error => {
        // Handle login error
        console.error('Login error:', error);
      }
    );
  }
}
