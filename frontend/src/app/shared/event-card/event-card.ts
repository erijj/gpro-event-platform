import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../core/models/event.model';
import { UiBadge } from '../ui-badge/ui-badge';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, UiBadge],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  event = input.required<Event>();
}
