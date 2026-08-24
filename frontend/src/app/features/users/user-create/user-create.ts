import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule, UiCard, UiButton],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css'
})
export class UserCreate {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['ROLE_USER', Validators.required]
  });

  onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.loading.set(true);
  this.userService.create(this.form.getRawValue() as any).subscribe({
    next: (user) => this.router.navigate(['/users', user.id]),
    error: (err) => {
      this.error.set('Erreur lors de la création');
      this.loading.set(false);
    }
  });
}
}