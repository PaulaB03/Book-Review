import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { HeaderComponent } from './header/header.component';
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books/books.component';
import { AdminComponent } from './admin/admin.component';
import { ReviewComponent } from './review/review.component';
import { ReviewService } from '../services/review.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    HeaderComponent,
    BookComponent,
    BooksComponent,
    AdminComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard, ReviewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
