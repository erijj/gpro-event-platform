import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { RouterLink } from '@angular/router';
import { UiButton } from '../../../shared/ui-button/ui-button';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink, UiButton],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  admins = computed(() => this.users().filter(u => u.role === 'ROLE_ADMIN'));
  regularUsers = computed(() => this.users().filter(u => u.role === 'ROLE_USER'));

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erreur lors du chargement des utilisateurs.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}