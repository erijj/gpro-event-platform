import { Component, input, signal } from '@angular/core';
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
  imageFailed = signal(false);

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
