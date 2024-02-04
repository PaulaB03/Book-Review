import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ReadingStatus } from '../../services/global.service';

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
  statusBool: boolean = false;
  selectedStatus: string = '';

  readingStatusOptions = [
    { label: 'Read', value: 'Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'WantToRead', value: 'WantToRead' },
  ];

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

  updateReadingStatus(bookId: number, newStatus: string): void {
    // Use a type assertion to inform TypeScript about the conversion
    const numericStatus = ReadingStatus[newStatus as keyof typeof ReadingStatus];

    this.apiService.updateReadingStatus(this.currentUser.id, bookId, numericStatus).subscribe(
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

  // Delete status
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

  getStatusString(status: any): string {
    return `${status.book.title} - ${ReadingStatus[status.readingStatus]}`;
  }

  compareFn(option1: ReadingStatus, option2: ReadingStatus): boolean {
    return option1 === option2;
  }
}
