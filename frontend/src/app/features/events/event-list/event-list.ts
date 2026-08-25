import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../core/models/event.model';
import { Category } from '../../../core/models/category.model';
import { EventService } from '../../../core/services/event.service';
import { CategoryService } from '../../../core/services/category.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiButton } from '../../../shared/ui-button/ui-button';
import { EventCard } from '../../../shared/event-card/event-card';
import { PageParticlesDirective } from '../../../shared/page-particles/page-particles';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, RouterLink, UiButton, EventCard, PageParticlesDirective],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  authService = inject(AuthService);

  searchTerm = signal('');
  selectedCategoryId = signal<number | null>(null);
  selectedDate = signal('');
  categories = signal<Category[]>([]);

  filteredEvents = computed(() => {
    let result = this.events();

    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      result = result.filter(e => e.titre.toLowerCase().includes(term));
    }

    const catId = this.selectedCategoryId();
    if (catId !== null) {
      result = result.filter(e => e.category.id === catId);
    }

    const date = this.selectedDate();
    if (date) {
      const filterDate = new Date(date);
      result = result.filter(e => new Date(e.dateHeure) >= filterDate);
    }

    return result;
  });

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erreur lors du chargement des événements.');
        this.loading.set(false);
        console.error(err);
      }
    });

    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: () => {}
    });
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategoryId.set(null);
    this.selectedDate.set('');
  }

  onCategoryChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategoryId.set(target.value ? +target.value : null);
  }
}