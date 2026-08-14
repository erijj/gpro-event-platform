import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  user = signal<User | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getById(id).subscribe({
      next: (data) => { this.user.set(data); this.loading.set(false); },
      error: () => { this.errorMessage.set('Erreur lors du chargement'); this.loading.set(false); }
    });
  }

  onDelete(): void {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.userService.delete(this.user()!.id).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => this.errorMessage.set('Erreur lors de la suppression')
      });
    }
  }
}