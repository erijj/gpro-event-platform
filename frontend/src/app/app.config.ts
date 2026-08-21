/*
  * Application configuration for the Angular application.
  * This configuration sets up providers for global error handling, change detection, routing, and HTTP client.
  * It is used to bootstrap the application with the necessary services and configurations.
  */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { routes } from './app.routes' 
import { authInterceptor } from './core/interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),// Enable zoneless change detection for improved performance
    provideRouter(routes),// Set up the router with the defined routes
    provideHttpClient(withInterceptors([authInterceptor])) // Set up the HTTP client for making API requests
  ]
};