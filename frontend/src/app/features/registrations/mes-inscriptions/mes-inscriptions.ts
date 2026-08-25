import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { Registration } from '../../../core/models/registration.model';
import { UiButton } from '../../../shared/ui-button/ui-button';
import { UiBadge } from '../../../shared/ui-badge/ui-badge';

@Component({
  selector: 'app-mes-inscriptions',
  standalone: true,
  imports: [DatePipe, UiButton, UiBadge],
  templateUrl: './mes-inscriptions.html',
  styleUrl: './mes-inscriptions.css'
})
export class MesInscriptions implements OnInit {
  private registrationService = inject(RegistrationService);
  authService = inject(AuthService);

  inscriptions = signal<Registration[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const userId = this.authService.currentUserId();
      if (userId) {
        this.loadInscriptions(userId);
      } else {
        this.inscriptions.set([]);
        this.loading.set(false);
      }
    });
  }

  displayedInscriptions = computed(() => {
    const all = this.inscriptions();
    const latestByEvent = new Map<number, Registration>();

    for (const r of all) {
      const existing = latestByEvent.get(r.eventId);
      if (!existing || new Date(r.dateInscription) > new Date(existing.dateInscription)) {
        latestByEvent.set(r.eventId, r);
      }
    }

    return Array.from(latestByEvent.values())
      .sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime());
  });

  ngOnInit(): void {}

  loadInscriptions(userId: number): void {
    this.loading.set(true);
    this.registrationService.getByUser(userId).subscribe({
      next: (data) => {
        this.inscriptions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }

  onAnnuler(id: number): void {
    if (!confirm('Annuler cette inscription ?')) return;

    this.registrationService.annuler(id).subscribe({
      next: () => {
        const userId = this.authService.currentUserId();
        if (userId) this.loadInscriptions(userId);
      },
      error: () => this.errorMessage.set('Erreur lors de l\'annulation')
    });
  }
}