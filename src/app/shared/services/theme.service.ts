import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'skolaris-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.#loadTheme());
  readonly theme = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';

  constructor() {
    effect(() => {
      this.#apply(this._theme());
    });
  }

  toggle(): void {
    this._theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  set(theme: Theme): void {
    this._theme.set(theme);
  }

  #loadTheme(): Theme {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'dark' || stored === 'light') return stored;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  #apply(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
