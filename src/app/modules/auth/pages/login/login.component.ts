import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoginResponse } from '../../dtos/login-response.dto';
import { UserCredentials } from '../../dtos/user-credentials.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterLink,
    LogoComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
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
      .pipe(first())
      .subscribe({
        next: (response: LoginResponse) => {
          if (this.form.value.rememberMe) {
            localStorage.setItem(environment.APP_REMEMBERED_EMAIL_KEY, userCredentials.email);
          } else {
            localStorage.removeItem(environment.APP_REMEMBERED_EMAIL_KEY);
          }

          localStorage.setItem(environment.APP_AUTH_TOKEN_KEY, response.accessToken);
          localStorage.setItem(environment.APP_USER_KEY, JSON.stringify(response.user));

          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        },
      });
  }

  sendWhatsappMessage(): void {
    const phoneNumber = environment.WHATSAPP_SUPPORT_NUMBER;
    const message = encodeURIComponent('Olá, preciso de ajuda com o Skolaris App.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
