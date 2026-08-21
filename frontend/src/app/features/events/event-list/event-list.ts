import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiButton } from '../../../shared/ui-button/ui-button';
import { EventCard } from '../../../shared/event-card/event-card';
import { HeroBackgroundDirective } from '../../../shared/hero-background/hero-background';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, RouterLink, UiButton, EventCard, HeroBackgroundDirective],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  authService = inject(AuthService);

  constructor(private eventService: EventService) {}

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
  }

}