import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/models/event.model';
import { UiBadge } from '../ui-badge/ui-badge';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe, RouterLink, UiBadge],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  event = input.required<Event>();

  statutLabel(statut: string): string {
    switch (statut) {
      case 'PLANIFIE': return 'Planifié';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'ANNULE': return 'Annulé';
      default: return statut;
    }
  }
}
