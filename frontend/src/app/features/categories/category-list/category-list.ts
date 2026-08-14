import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erreur lors du chargement des catégories.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}