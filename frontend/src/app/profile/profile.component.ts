import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  userStatuses: any[] = [];
  userId: number | undefined;
  newRole: string | undefined;

  constructor(private authService: AuthService, private apiService: ApiService) {
    this.currentUser = authService.getUser();
  }

  ngOnInit() {
    // Call the API to get user statuses
    this.apiService.getUserStatuses(this.currentUser.id).subscribe(
      (statuses) => {
        this.userStatuses = statuses;
      },
      (error) => {
        console.error('Error fetching user statuses:', error);
      }
    );
  }

  test() {
    console.log(this.currentUser);
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


  // For example, you can have a function to update the reading status
  updateReadingStatus(bookId: number, newStatus: string): void {
    this.apiService.updateReadingStatus(this.currentUser.id, bookId, newStatus).subscribe(
      () => {
        console.log('Reading status updated successfully!');
        // Refresh the user statuses after updating
        this.ngOnInit();
      },
      (error) => {
        console.error('Error updating reading status:', error);
      }
    );
  }

  // Another function to delete a status
  deleteStatus(bookId: number): void {
    this.apiService.deleteStatus(this.currentUser.id, bookId).subscribe(
      () => {
        console.log('Status deleted successfully!');
        // Refresh the user statuses after deleting
        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting status:', error);
      }
    );
  }
}
