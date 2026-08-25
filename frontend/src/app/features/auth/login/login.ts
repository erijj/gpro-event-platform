import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';
import { PageParticlesDirective } from '../../../shared/page-particles/page-particles';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, UiCard, UiButton, PageParticlesDirective],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Email ou mot de passe incorrect'
        );
      },
    });
  }

  onContinueAsGuest(): void {
    this.router.navigate(['/events']);
  }
}