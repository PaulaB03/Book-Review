import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  @Input() review: any;
  @Input() isProfile: boolean = false;
  isLoggedIn: boolean = false;
  isEditing: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
  updatedReview: any = {};
  
  constructor(private reviewService: ReviewService, private apiService: ApiService,private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getUser().id === this.review.user.id;
    console.log(this.review);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.updatedReview.rating = this.review.rating;
      this.updatedReview.comment = this.review.comment;
    }
  }

  updateRating(rating: number) {
    this.updatedReview.rating = rating;
  }

  updateReview() {
    this.apiService.updateReview(this.review.bookId, this.review.userId, this.updatedReview).subscribe(
      () => {
        console.log('Review updated successfully!');
        this.isEditing = false;
        this.reviewService.notifyReviewDeleted();
      },
      (error) => {
        console.error('Error updating review:', error);
      }
    );
  }

  deleteReview() {
    this.apiService.deleteReview(this.review.bookId, this.review.userId).subscribe(
      () => {
        console.log('Review deleted successfully!');
        this.reviewService.notifyReviewDeleted();
      },
      (error) => {
        console.error('Error deleting status:', error);
      }
    )
  }
}
