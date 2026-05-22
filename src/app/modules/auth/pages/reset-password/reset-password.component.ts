import { HttpErrorResponse } from '@angular/common/http';
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
import { delay, first, tap } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { GetResetPasswordDto } from '../../dtos/get-reset-password.dto';
import { LoginResponse } from '../../dtos/login-response.dto';
import { UserCredentials } from '../../dtos/user-credentials.dto';
import { AuthService } from '../../services/auth.service';
import { MessageDto } from '../../../../common/dtos/message.dto';

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
    LogoComponent,
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
  private readonly toastService = inject(ToastService);

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
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
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
      .pipe(
        first(),
        tap(() =>
          this.toastService.success(
            'Sua senha foi redefinida com sucesso! Você será redirecionado para a página de login.',
          ),
        ),
        delay(2000),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        },
      });
  }
}
