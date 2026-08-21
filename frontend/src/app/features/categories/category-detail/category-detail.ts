import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-category-detail',
  imports: [RouterLink],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.css'
})
export class CategoryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  category = signal<Category | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  categoryId = Number(this.route.snapshot.paramMap.get('id'));
  authService = inject(AuthService);


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryService.getById(id).subscribe({
      next: (data) => {
        this.category.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }

  onDelete(): void {
    if (!confirm('Supprimer cette catégorie ?')) return;

    this.categoryService.delete(this.categoryId).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: () => this.errorMessage.set('Suppression impossible (catégorie utilisée par un événement)')
    });
  }
}
