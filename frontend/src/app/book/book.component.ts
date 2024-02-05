import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ReadingStatus } from '../../services/global.service';
import { skip } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  bookId: number = 0;
  rating: number = 0;
  book: any;
  isUserActive: boolean = false;
  UserReview: boolean = false;
  statusBool: boolean = false;
  ratingBool: boolean = false;
  reviews: any[] = [];
  status: any;
  selectedStatus: string = '';
  reviewForm: FormGroup;

  readingStatusOptions = [
    { label: 'Read', value: 'Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'WantToRead', value: 'WantToRead' },
  ];

  constructor(private reviewService: ReviewService, private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService, private formBuilder: FormBuilder) {
    this.reviewForm = this.formBuilder.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const bookId = +params.get('id')!;
      this.bookId = bookId;

      if (bookId) {
        this.loadBookDetails(bookId);
        this.loadReviews(bookId);
      }
    });

    this.isUserActive = this.authService.isLoggedIn();
    this.checkUserStatus();
    this.checkUserReview();
    this.loadTotalRating();

    this.reviewService.reviewDeleted$.subscribe(() => {
      this.loadReviews(this.bookId);
      this.checkUserReview();
      this.loadTotalRating();
    });
  }

  loadBookDetails(bookId: number) {
    this.apiService.getBookById(this.bookId).subscribe(
      (data) => {
        this.book = data;
      },
      (error) => {
        console.error('Error loading book details:', error);
      }
    );
  }

  // Reviews functions
  addReview() {
    if (this.reviewForm.valid) {
      const reviewData = {
        userId: this.authService.getUserId(),
        bookId: this.bookId,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };

      this.apiService.addReview(reviewData).subscribe(
        (response) => {
          console.log('Review added successfully:', response);
          this.loadReviews(this.bookId);
          this.UserReview = true; 
        },
        (error) => {
          console.error('Error adding review:', error);
        }
      );
    }
  }

  loadTotalRating() {
    this.apiService.getTotalRating(this.bookId).subscribe(
      (totalRating) => {
        this.rating = totalRating;
      },
      (error) => {
        console.error('Error loading total rating:', error);
      }
    );
  }

  loadReviews(bookId: number) {
    this.reviews = [];
    this.apiService.getReviews(bookId).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.ratingBool = reviews.length > 0;
        this.loadTotalRating();
      },
      (error) => {
        if (error.status === 404) {
          this.ratingBool = false;

          console.log("No reviews");
        }
        else {
          console.error('Error loading reviews:', error);
        }
      }
    );
  }

  checkUserReview() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.apiService.getUserReview(userId, this.bookId).subscribe(
        (userReview) => {
          this.UserReview = true;
        },
        (error) => {
          if (error.status === 404) {
            this.UserReview = false;
            console.log("User doesn't have a review");
          }
          else {
            console.error('Error checking user rating:', error);
          }
        }
      );
    }
  }

  // Status functions
  checkUserStatus() {
    this.apiService.getUserStatus(this.authService.getUserId(), this.bookId).subscribe(
      (status) => {
        this.statusBool = true;
        this.status = status;
      },
      (error) => {
        if (error.status === 404) {
          this.statusBool = false;
        } else {
          console.error('Error checking user status:', error);
        }
      }
    );
  }

  addStatus(newStatus: string) {
    // Use a type assertion to inform TypeScript about the conversion
    const numericStatus = ReadingStatus[newStatus as keyof typeof ReadingStatus];

    this.apiService.createStatus(this.authService.getUserId(), this.bookId, numericStatus).subscribe(
      () => {
        console.log('Status added successfully!');
        // Refresh the user statuses after adding
        this.checkUserStatus();
      },
      (error) => {
        console.error('Error adding status:', error);
      }
    );
  }

  updateReadingStatus(newStatus: string): void {
    // Use a type assertion to inform TypeScript about the conversion
    const numericStatus = ReadingStatus[newStatus as keyof typeof ReadingStatus];

    this.apiService.updateReadingStatus(this.authService.getUserId(), this.bookId, numericStatus).subscribe(
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

  getStatusString() {
    return `${this.status.book.title} - ${ReadingStatus[this.status.readingStatus]}`;
  }

  ngOnDestroy() {
    this.book = undefined;
  }
}
