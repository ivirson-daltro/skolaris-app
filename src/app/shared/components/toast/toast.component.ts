import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastData {
  message: string;
  type: ToastType;
}

@Component({
  selector: 'app-toast',
  imports: [MatIcon, MatIconButton],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly data: ToastData = inject(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef);

  get icon(): string {
    const icons: Record<ToastType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
    };
    return icons[this.data.type];
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
