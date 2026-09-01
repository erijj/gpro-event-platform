import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
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
  private sanitizer = inject(DomSanitizer);
  authService = inject(AuthService);
  private router = inject(Router);

  eventId = Number(this.route.snapshot.paramMap.get('id'));
  event = signal<Event | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  inscriptionMessage = signal<string | null>(null);

  private static readonly ONLINE_KEYWORDS = ['en ligne', 'online', 'visio', 'virtuel', 'zoom', 'teams', 'meet'];

  isOnline = computed(() => {
    const e = this.event();
    if (!e) return false;
    const lieu = e.lieu.trim().toLowerCase();
    return EventDetail.ONLINE_KEYWORDS.some(k => lieu.includes(k));
  });

  mapUrl = computed(() => {
    const e = this.event();
    if (!e) return '';
    const url = `https://www.google.com/maps?q=${encodeURIComponent(e.lieu)}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  directionsUrl = computed(() => {
    const e = this.event();
    if (!e) return '';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.lieu)}`;
  });

  statutLabel(statut: string): string {
    switch (statut) {
      case 'PLANIFIE': return 'Planifié';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'ANNULE': return 'Annulé';
      default: return statut;
    }
  }

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
        const msg: string = err.error?.message || '';
        this.inscriptionMessage.set(
          msg.includes('déjà inscrit')
            ? 'Vous êtes déjà inscrit à cet événement.'
            : msg || 'Erreur : déjà inscrit ou plus de places'
        );
      }
    });
  }
}