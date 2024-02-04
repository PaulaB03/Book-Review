import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewDeletedSubject = new Subject<void>();

  reviewDeleted$ = this.reviewDeletedSubject.asObservable();

  notifyReviewDeleted() {
    this.reviewDeletedSubject.next();
  }
}
