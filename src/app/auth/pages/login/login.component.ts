import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../environments/environment.development';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCredentials } from '../../dtos/user-credentials.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginResponse } from '../../dtos/login-response.dto';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);

  form!: FormGroup;
  hidePassword = true;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    const savedEmail = localStorage.getItem(environment.APP_REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      this.form.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userCredentials: UserCredentials = this.form.value;
    this.authService
      .login(userCredentials)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response: LoginResponse) => {
          if (this.form.value.rememberMe) {
            localStorage.setItem(environment.APP_REMEMBERED_EMAIL_KEY, userCredentials.email);
          } else {
            localStorage.removeItem(environment.APP_REMEMBERED_EMAIL_KEY);
          }

          localStorage.setItem(environment.APP_AUTH_TOKEN_KEY, response.access_token);
          // Navigate to the dashboard or home page after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // Handle login error
        },
      });
  }
}
