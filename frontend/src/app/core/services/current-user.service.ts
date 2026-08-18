import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  currentUserId = signal<number | null>(null);

  setUser(id: number) {
    this.currentUserId.set(id);
  }
}