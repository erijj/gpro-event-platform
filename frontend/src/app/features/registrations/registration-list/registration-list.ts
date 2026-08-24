import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Registration } from '../../../core/models/registration.model';
import { RegistrationService } from '../../../core/services/registration.service';

interface EventGroup {
  eventTitre: string;
  registrations: Registration[];
  count: number;
}

@Component({
  selector: 'app-registration-list',
  imports: [CommonModule],
  templateUrl: './registration-list.html',
  styleUrl: './registration-list.css'
})
export class RegistrationList implements OnInit {
  registrations = signal<Registration[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  confirmedGroups = computed<EventGroup[]>(() => {
    const map = new Map<string, Registration[]>();
    for (const r of this.registrations()) {
      if (r.statut !== 'CONFIRMEE') continue;
      const arr = map.get(r.eventTitre) ?? [];
      arr.push(r);
      map.set(r.eventTitre, arr);
    }
    return Array.from(map.entries()).map(([eventTitre, registrations]) => ({
      eventTitre, registrations, count: registrations.length
    }));
  });

  cancelledGroups = computed<EventGroup[]>(() => {
    const map = new Map<string, Registration[]>();
    for (const r of this.registrations()) {
      if (r.statut !== 'ANNULEE') continue;
      const arr = map.get(r.eventTitre) ?? [];
      arr.push(r);
      map.set(r.eventTitre, arr);
    }
    return Array.from(map.entries()).map(([eventTitre, registrations]) => ({
      eventTitre, registrations, count: registrations.length
    }));
  });

  confirmedCount = computed(() =>
    this.confirmedGroups().reduce((sum, g) => sum + g.count, 0)
  );

  cancelledCount = computed(() =>
    this.cancelledGroups().reduce((sum, g) => sum + g.count, 0)
  );

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.registrationService.getAll().subscribe({
      next: (data) => {
        this.registrations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erreur lors du chargement des inscriptions.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}