import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AcceptInviteResponseDto } from '../dtos/accept-invite-response.dto';
import { MessageDto } from '../../../common/dtos/message.dto';
import { GetResetPasswordDto } from '../dtos/get-reset-password.dto';
import { LoginResponse } from '../dtos/login-response.dto';
import { UserCredentials } from '../dtos/user-credentials.dto';
import { Router } from '@angular/router';
import { AcceptInviteRequestDto } from '../dtos/accept-invite-request.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
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

  postResetPassword(token: string, password: string): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.apiUrl}/auth/reset-password`, { token, password });
  }

  validateInvite(token: string): Observable<AcceptInviteRequestDto> {
    return this.http.get<AcceptInviteRequestDto>(`${this.apiUrl}/auth/invitations/${token}`);
  }

  acceptInvite(token: string, username: string): Observable<AcceptInviteResponseDto> {
    return this.http.post<AcceptInviteResponseDto>(`${this.apiUrl}/auth/accept-invite`, {
      token,
      username,
    });
  }

  getToken(): string | null {
    return localStorage.getItem(environment.APP_AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(environment.APP_AUTH_TOKEN_KEY);
    localStorage.removeItem(environment.APP_USER_KEY);
    this.router.navigate(['/auth/login']);
  }
}
