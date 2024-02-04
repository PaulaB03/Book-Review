import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  books: any[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.apiService.getBooks().subscribe(
      (data) => {
        this.books = data;
      },
      (error) => {
        console.error('Error loading books:', error);
      }
    );
  }

  goToBook(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }

  test() {
    console
  }
}
