import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { LoginResponse } from '../../dtos/login-response.dto';
import { UserCredentials } from '../../dtos/user-credentials.dto';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';
import { GetResetPasswordDto } from '../../dtos/get-reset-password.dto';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  token?: string;
  resetPasswordInfo?: GetResetPasswordDto;

  ngOnInit(): void {
    this.buildForm();

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.getResetPasswordInfo();
      }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  getResetPasswordInfo(): void {
    this.authService
      .getResetPassword(this.token!)
      .pipe(first())
      .subscribe({
        next: (response: GetResetPasswordDto) => {
          this.resetPasswordInfo = response;
        },
        error: (error) => {
          // Handle reset password error
        },
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userCredentials: UserCredentials = this.form.value;
    this.authService
      .postResetPassword(this.token!, userCredentials.password)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response: LoginResponse) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          // Handle login error
        },
      });
  }
}
