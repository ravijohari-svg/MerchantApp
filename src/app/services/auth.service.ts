import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

    constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post(
      `${environment.apiUrl}/auth/login`,
      payload
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }
}