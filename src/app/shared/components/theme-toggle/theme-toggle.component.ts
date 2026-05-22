import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatIcon, MatIconButton],
  template: `
    <button
      mat-icon-button
      [attr.aria-label]="themeService.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'"
      (click)="themeService.toggle()"
    >
      <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
