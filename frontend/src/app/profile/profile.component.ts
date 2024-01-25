import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userId: number | undefined;
  newRole: string | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

  test() {
    this.authService.printUser();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  changeUserRole(): void {
    const token = this.authService.getToken();

    if (token) {
      // Check if userId is defined before making the HTTP request
      if (this.userId !== undefined) {
        if (this.newRole === 'admin' || this.newRole === 'user') {
          this.authService.changeUserRole(this.userId, this.newRole, token).subscribe((response) => {
              console.log('User role changed successfully', response);
            },
            (error) => {
              if (error.status === 404) {
                console.error(`User with ID ${this.userId} not found`);
              } else {
                console.error('Error changing user role', error);
                // Handle other errors as needed
              }
            }
          );
        } else {
          console.error('User role must be admin or user');
        }
      } else {
        console.error('User ID is undefined. Cannot change user role.');
        // Handle the case where userId is undefined
      }
    } else {
      console.error('Token not found. User not authenticated.');
      // Handle the case where the token is not available (user not authenticated)
    }
  }
}
