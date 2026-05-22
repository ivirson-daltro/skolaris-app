import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { GetResetPasswordDto } from '../../dtos/get-reset-password.dto';
import { LoginResponse } from '../../dtos/login-response.dto';
import { UserCredentials } from '../../dtos/user-credentials.dto';
import { AuthService } from '../../services/auth.service';

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
    MatDividerModule,
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
    this.form = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*\d)/)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator },
    );
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

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
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
