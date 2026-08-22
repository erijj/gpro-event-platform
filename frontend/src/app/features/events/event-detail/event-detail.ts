import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';
import { UiCard } from '../../../shared/ui-card/ui-card';
import { UiButton } from '../../../shared/ui-button/ui-button';
import { UiBadge } from '../../../shared/ui-badge/ui-badge';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, RouterLink, UiCard, UiButton, UiBadge],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private registrationService = inject(RegistrationService);
  authService = inject(AuthService);
  private router = inject(Router);

  eventId = Number(this.route.snapshot.paramMap.get('id'));
  event = signal<Event | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  inscriptionMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.eventService.getById(this.eventId).subscribe({
      next: (data) => {
        this.event.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }

  onDelete(): void {
    if (!confirm('Supprimer cet événement ?')) return;
    this.eventService.delete(this.eventId).subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => this.errorMessage.set('Suppression impossible (des inscriptions existent peut-être)')
    });
  }

  onInscrire(): void {
    if (this.authService.isAdmin()) {
      this.inscriptionMessage.set('Les administrateurs ne peuvent pas s\'inscrire aux événements');
      return;
    }
    const userId = this.authService.currentUserId();
    if (!userId) {
      this.inscriptionMessage.set('Connectez-vous d\'abord');
      return;
    }
    this.inscriptionMessage.set(null);
    this.registrationService.create({ userId, eventId: this.eventId }).subscribe({
      next: () => {
        this.inscriptionMessage.set('Inscription réussie !');
        this.eventService.getById(this.eventId).subscribe((data) => this.event.set(data));
      },
      error: (err) => {
        this.inscriptionMessage.set(err.error?.message || 'Erreur : déjà inscrit ou plus de places');
      }
    });
  }
}