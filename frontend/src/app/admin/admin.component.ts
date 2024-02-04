import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userId: number | undefined;
  newRole: string | undefined;
  bookForm = new FormGroup({
    title: new FormControl(''),
    authorId: new FormControl(''),
    description: new FormControl(''),
    coverUrl: new FormControl('')
  });
  updateBookForm = new FormGroup({
    title: new FormControl(''),
    authorId: new FormControl(''),
    description: new FormControl(''),
    coverUrl: new FormControl('')
  });
  authorForm = new FormGroup({
    name: new FormControl(''),
    bio: new FormControl('')
  });
  updateAuthorForm = new FormGroup({
    name: new FormControl(''),
    bio: new FormControl('')
  });
  bookIdInput: FormControl = new FormControl('', Validators.required);
  authorIdInput: FormControl = new FormControl('', Validators.required);
  isFormVisible: boolean = false;
  isFormTrue: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    if(!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/books']);
    }
  }

  // Add author
  addAuthor() {
    console.log('Adding Author:', this.authorForm.value);

    // Call the API service to add a new author by passing the form value
    this.apiService.addAuthor(this.authorForm.value).subscribe(
      (response) => {
        console.log('Author added successfully:', response);
        // Reset the form
        this.authorForm.reset();
      },
      (error) => {
        console.error('Error adding author:', error);
      }
    );
  }

  // Add book
  addBook() {
    console.log('Book Form Data:', this.bookForm.value);

    // Call the API service to add a new book by passing the form value
    this.apiService.createBook(this.bookForm.value).subscribe(
      (response) => {
        console.log('Book added successfully:', response);
        // Reset the form
        this.bookForm.reset();
      },
      (error) => {
        console.error('Error adding book:', error);
      }
    );
  }

  // Load author details
  loadAuthorDetails() {
    const authorId = this.authorIdInput.value;

    if (authorId && !isNaN(authorId)) {
      this.apiService.getAuthorById(authorId).subscribe(
        (author) => {
          // Set form values based on the loaded author
          this.updateAuthorForm.patchValue(author);
          this.isFormTrue = true;
        },
        (error) => {
          console.error('Error loading author details:', error);
          // Hide the form if there's an error
          this.isFormTrue = false;
        }
      );
    } else {
      // Hide the form if the authorId is not valid
      this.isFormTrue = false;
    }
  }

  // Update Author
  updateAuthor() {
    const authorId = this.authorIdInput.value;
    // Call the API service to update an existing author
    this.apiService.updateAuthor(authorId, this.updateAuthorForm.value).subscribe(
      (response) => {
        console.log('Author updated successfully:', response);
        // Optionally, reset the form and hide it after successful update
        this.updateAuthorForm.reset();
        this.isFormTrue = false;
      },
      (error) => {
        console.error('Error updating author:', error);
      }
    );
  }

  // Load book details
  loadBookDetails() {
    const bookId = this.bookIdInput.value;

    if (bookId && !isNaN(bookId)) {
      this.apiService.getBookById(bookId).subscribe(
        (book) => {
          // Set form values based on the loaded book
          this.updateBookForm.patchValue(book);
          this.isFormVisible = true;
        },
        (error) => {
          console.error('Error loading book details:', error);
          // Hide the form if there's an error
          this.isFormVisible = false;
        }
      );
    } else {
      // Hide the form if the bookId is not valid
      this.isFormVisible = false;
    }
  }

  // Update book
  updateBook() {
    const bookId = this.bookIdInput.value;
    // Call the API service to update an existing book
    this.apiService.updateBook(bookId, this.updateBookForm.value).subscribe(
      (response) => {
        console.log('Book updated successfully:', response);
        this.updateBookForm.reset();
        this.isFormVisible = false;
      },
      (error) => {
        console.error('Error updating book:', error);
      }
    );
  }

  changeUserRole() {
    const token = this.authService.getToken();

      // Check if userId is defined before making the HTTP request
    if (this.userId !== undefined) {
      if (this.newRole === 'admin' || this.newRole === 'user') {
        this.authService.changeUserRole(this.userId, this.newRole).subscribe((response) => {
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
  }
}
