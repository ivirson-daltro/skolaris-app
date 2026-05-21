import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserCredentials } from '../dtos/user-credentials.dto';
import { LoginResponse } from '../dtos/login-response.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MessageDto } from '../../common/dtos/message.dto';
import { GetResetPasswordDto } from '../dtos/get-reset-password.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(userCredentials: UserCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, userCredentials);
  }

  forgotPassword(email: string): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  getResetPassword(token: string): Observable<GetResetPasswordDto> {
    return this.http.get<GetResetPasswordDto>(`${this.apiUrl}/auth/reset-password/${token}`);
  }

  postResetPassword(token: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/reset-password`, { token, password });
  }
}
