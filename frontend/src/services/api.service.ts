import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7113/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  // Author API
  getAuthors(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/author`, { headers });
  }

  getAuthorById(authorId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/author/${authorId}`, { headers });
  }

  addAuthor(newAuthorData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/author`, newAuthorData, { headers });
  }

  updateAuthor(authorId: number, updatedAuthorData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/author/${authorId}`, updatedAuthorData, { headers });
  }

  // Book API
  getBooks(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/books`);
  }

  getBookById(bookId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/books/${bookId}`, { headers });
  }

  createBook(bookData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/books`, bookData, { headers });
  }

  updateBook(bookId: number, updatedBookData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/books/${bookId}`, updatedBookData, { headers });
  }

  deleteBook(bookId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/books/${bookId}`, { headers });
  }

  // Status API 
  getUserStatuses(userId: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/status/${userId}`, { headers });
  }

  getUserStatus(userId: number, bookId: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/status/${userId}/${bookId}`, { headers });
  }

  createStatus(userId: number, bookId: number, readingStatus: number): Observable<any> {
    const headers = this.getHeaders();
    const statusData = { userId, bookId, readingStatus };

    return this.http.post<any>(`${this.baseUrl}/status`, statusData, { headers });
  }
  
  updateReadingStatus(userId: number, bookId: number, newStatus: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/status/${userId}/${bookId}`, newStatus, { headers });

  }
  
  deleteStatus(userId: number, bookId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/status/${userId}/${bookId}`, { headers });
  }

  // Reviews API
  getReviews(bookId: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/review/${bookId}`, { headers });
  }

  getUserReview(userId: number, bookId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/review/${bookId}/${userId}`, { headers });
  }

  getUserReviews(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/review/User/${this.authService.getUserId()}`, { headers });
  }

  addReview(review: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/review`, review, { headers });
  }

  updateReview(bookId: number, userId: number, updatedReview: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/review/${bookId}/${userId}`, updatedReview, { headers });
  }

  deleteReview(bookId: number, userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/review/${bookId}/${userId}`, { headers });
  }

  getTotalRating(bookId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/review/TotalRating/${bookId}`);
  }
}
