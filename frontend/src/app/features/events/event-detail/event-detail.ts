import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  imports: [RouterLink],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private router = inject(Router);

  eventId = Number(this.route.snapshot.paramMap.get('id'));
  event = signal<Event | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

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
}