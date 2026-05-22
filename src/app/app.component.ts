import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly title = signal('app');
  private readonly themeService = inject(ThemeService);
}
