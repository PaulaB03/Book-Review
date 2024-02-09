import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ReviewService } from '../../services/review.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  reviews: any[] = [];

  constructor(private reviewService: ReviewService, private authService: AuthService, private apiService: ApiService) {
    this.currentUser = authService.getUser();
  }

  ngOnInit() {
    this.getUserReviews();

    this.reviewService.reviewDeleted$.subscribe(() => {
      this.getUserReviews();
    });
  }

  getUserReviews() {
    // Call the API to get user reviews
    this.apiService.getUserReviews().subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      (error) => {
        console.error('Error fetching user statuses:', error);
      }
    );
  }
}
