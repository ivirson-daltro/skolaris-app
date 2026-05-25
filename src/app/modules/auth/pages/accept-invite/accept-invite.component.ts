import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AcceptInviteResponseDto } from '../../dtos/accept-invite-response.dto';
import { AuthService } from '../../services/auth.service';
import { AcceptInviteRequestDto } from '../../dtos/accept-invite-request.dto';

@Component({
  selector: 'app-accept-invite',
  imports: [RouterLink, MatIcon, MatButton, LogoComponent],
  templateUrl: './accept-invite.component.html',
  styleUrl: './accept-invite.component.scss',
})
export class AcceptInviteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  token = '';
  userInfo: AcceptInviteRequestDto | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.toastService.error('Link de convite inválido ou expirado.');
      this.router.navigate(['/auth/login']);
    }

    this.validateInvite();
  }

  validateInvite(): void {
    if (!this.token) return;

    this.authService
      .validateInvite(this.token)
      .pipe(first())
      .subscribe({
        next: (response: AcceptInviteRequestDto) => {
          this.userInfo = response;
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error?.message || 'Link de convite inválido ou expirado.');
          this.router.navigate(['/auth/login']);
        },
      });
  }

  acceptInvite(): void {
    if (!this.token || !this.userInfo) return;

    this.authService
      .acceptInvite(this.token, this.userInfo?.adminName)
      .pipe(first())
      .subscribe({
        next: (response: AcceptInviteResponseDto) => {
          this.toastService.success(
            'Convite aceito com sucesso! Sua senha temporária foi enviada ao email ' +
              this.userInfo?.email +
              '. Você será redirecionado para a tela de login.',
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error?.message || 'Não foi possível aceitar o convite.');
        },
      });
  }
}
