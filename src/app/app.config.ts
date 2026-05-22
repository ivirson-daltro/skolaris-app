import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([loadingInterceptor])),
  ],
};
