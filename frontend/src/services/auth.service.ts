import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7113/api/User'; 

  // store user info
  private currentUser: any;
  
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.loadUserFromCookies();
   }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  logout(): void {
    // Remove the token from cookies or local storage
    this.cookieService.delete('token');
    this.cookieService.delete('user');
    this.currentUser = undefined;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // Check if the user is logged in (token exists)
    return this.cookieService.check('token');

  }

  isAdmin(): boolean {
    // Check if the current user has admin role
    return this.currentUser && this.currentUser.role === 'admin';
  }

  printUser() {
    console.log(this.currentUser);
  }

  getUser() {
    return this.currentUser;
  }

  setTokenAndUser(token: string, user: any): void {
    // Set the token and user information in cookies
    this.cookieService.set('token', token);
    this.cookieService.set('user', JSON.stringify(user));
    // Update the currentUser property
    this.currentUser = user;
  }

  private loadUserFromCookies(): void {
    const userString = this.cookieService.get('user');
    this.currentUser = userString ? JSON.parse(userString) : null;
  }

  getToken(): string | undefined {
    // Get the token from cookies
    return this.cookieService.get('token');
  }

  changeUserRole(userId: number, newRole: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/updateRole/${userId}?newRole=${newRole}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    const body = { newRole }; // Assuming your backend expects JSON in the request body

    return this.http.put(url, body, { headers });
  }
}