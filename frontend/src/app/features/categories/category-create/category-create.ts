import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, UiCard, UiButton],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css'
})
export class CategoryCreate {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    libelle: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.categoryService.create({ libelle: this.form.value.libelle! }).subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.errorMessage.set('Erreur lors de la création');
      }
    });
  }
}