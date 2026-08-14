import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Registration } from '../../../core/models/registration.model';
import { RegistrationService } from '../../../core/services/registration.service';

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