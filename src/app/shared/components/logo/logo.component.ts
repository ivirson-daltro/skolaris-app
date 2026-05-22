import { Component, inject, input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-logo',
  imports: [],
  template: `
    <img
      [src]="themeService.isDark() ? darkSrc() : lightSrc()"
      [alt]="alt()"
      [class]="cssClass()"
    />
  `,
  styles: `
    .logo {
      height: 64px;
      margin-bottom: 1.5rem;
    }

    .brand-logo {
      height: 40px;
      width: auto;
    }
  `,
})
export class LogoComponent {
  protected readonly themeService = inject(ThemeService);
  lightSrc = input.required<string>();
  darkSrc = input.required<string>();
  alt = input<string>('Logo');
  cssClass = input<string>('');
}
