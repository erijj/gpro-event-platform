import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UiCard } from '../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UiCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  initials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return (u.prenom.charAt(0) + u.nom.charAt(0)).toUpperCase();
  });

  roleLabel = computed(() => {
    const role = this.user()?.role;
    if (role === 'ROLE_ADMIN') return 'Administrateur';
    return 'Participant';
  });
}
