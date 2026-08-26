import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';

@Component({
  selector: 'app-event-edit',
  imports: [ReactiveFormsModule, UiCard, UiButton],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.css'
})
export class EventEdit implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventId = Number(this.route.snapshot.paramMap.get('id'));
  categories = signal<Category[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    titre: ['', Validators.required],
    description: [''],
    dateHeure: ['', Validators.required],
    lieu: ['', Validators.required],
    capaciteMax: [1, [Validators.required, Validators.min(1)]],
    categoryId: [null as number | null, Validators.required],
    image: ['']
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data)
    });

    this.eventService.getById(this.eventId).subscribe({
      next: (data) => {
        this.form.patchValue({
          titre: data.titre,
          description: data.description,
          dateHeure: data.dateHeure,
          lieu: data.lieu,
          capaciteMax: data.capaciteMax,
          categoryId: data.category.id,
          image: data.image ?? ''
        });
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

    this.eventService.update(this.eventId, {
      titre: this.form.value.titre!,
      description: this.form.value.description!,
      dateHeure: this.form.value.dateHeure!,
      lieu: this.form.value.lieu!,
      capaciteMax: this.form.value.capaciteMax!,
      categoryId: this.form.value.categoryId!,
      image: this.form.value.image || null
    }).subscribe({
      next: () => this.router.navigate(['/events', this.eventId]),
      error: () => this.errorMessage.set('Erreur lors de la modification')
    });
  }
}