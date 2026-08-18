import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CurrentUserService } from './core/services/current-user.service';
import { UserService } from './core/services/user.service';
import { User } from './core/models/user.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html'
})
export class App implements OnInit {
  currentUserService = inject(CurrentUserService);
  private userService = inject(UserService);

  users = signal<User[]>([]);

  ngOnInit() {
    this.userService.getAll().subscribe((data) => this.users.set(data));
  }

  onUserChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.currentUserService.setUser(id);
  }
}