import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private baseUrl = `${environment.apiUrl}/dev/merchant/auth`;

  constructor(private http: HttpClient) {}

  
  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email-login`, payload);
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-details`, payload);
  }

  sendOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, payload);
  }

  verifyOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, payload);
  }

  forgotPassword(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-email-password`, payload);
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload);
  }


  saveAuth(token: string, role?: string): void {
    localStorage.setItem('token', token);

    if (role) {
      localStorage.setItem('role', role);
    }
  }

 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  getRole(): string | null {
    return localStorage.getItem('role');
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }
}