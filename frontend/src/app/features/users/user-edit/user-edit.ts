import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, UiCard, UiButton],
  templateUrl: './user-edit.html'
})
export class UserEdit implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  userId!: number;

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['ROLE_USER', Validators.required]
  });

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getById(this.userId).subscribe((user) => {
      this.form.patchValue(user);
    });
  }

  onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.loading.set(true);
  this.userService.update(this.userId, this.form.getRawValue() as any).subscribe({
    next: () => this.router.navigate(['/users', this.userId]),
    error: () => {
      this.error.set('Erreur lors de la modification');
      this.loading.set(false);
    }
  });
}
}