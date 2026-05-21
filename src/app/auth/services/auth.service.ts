import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserCredentials } from '../dtos/user-credentials.dto';
import { LoginResponse } from '../dtos/login-response.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(userCredentials: UserCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', userCredentials);
  }
}
