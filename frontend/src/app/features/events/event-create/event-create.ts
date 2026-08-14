import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule],
  templateUrl: './event-create.html',
  styleUrl: './event-create.css'
})
export class EventCreate implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    titre: ['', Validators.required],
    description: [''],
    dateHeure: ['', Validators.required],
    lieu: ['', Validators.required],
    capaciteMax: [1, [Validators.required, Validators.min(1)]],
    categoryId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.eventService.create({
      titre: this.form.value.titre!,
      description: this.form.value.description!,
      dateHeure: this.form.value.dateHeure!,
      lieu: this.form.value.lieu!,
      capaciteMax: this.form.value.capaciteMax!,
      categoryId: this.form.value.categoryId!
    }).subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => this.errorMessage.set('Erreur lors de la création')
    });
  }
}