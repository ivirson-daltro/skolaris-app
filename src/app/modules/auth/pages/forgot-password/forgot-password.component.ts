import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { MessageDto } from '../../../../common/dtos/message.dto';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;
    this.authService
      .forgotPassword(email)
      .pipe(first())
      .subscribe({
        next: (response: MessageDto) => {
          this.toastService.success(response.message);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        },
      });
  }
}
