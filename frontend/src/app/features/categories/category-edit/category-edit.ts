import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css'
})
export class CategoryEdit implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId = Number(this.route.snapshot.paramMap.get('id'));
  errorMessage = signal<string | null>(null);
  loading = signal(true);

  form = this.fb.group({
    libelle: ['', Validators.required]
  });

  ngOnInit(): void {
    this.categoryService.getById(this.categoryId).subscribe({
      next: (data) => {
        this.form.patchValue({ libelle: data.libelle });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.categoryService.update(this.categoryId, { libelle: this.form.value.libelle! }).subscribe({
      next: () => this.router.navigate(['/categories', this.categoryId]),
      error: () => this.errorMessage.set('Erreur lors de la modification')
    });
  }
}