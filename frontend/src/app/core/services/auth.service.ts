import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<LoginResponse | null>(this.restoreFromStorage());

  // Dérivés pratiques, pour remplacer CurrentUserService sans réécrire les composants
  currentUserId = computed(() => this.currentUser()?.userId ?? null);
  currentUserRole = computed(() => this.currentUser()?.role ?? null);
  isAdmin = computed(() => this.currentUserRole() === 'ROLE_ADMIN');
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private http: HttpClient) {}

  private restoreFromStorage(): LoginResponse | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginResponse;
    } catch {
      // JSON corrompu : on nettoie pour éviter de replanter à chaque F5
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return null;
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      request
    ).pipe(
      tap(response => {
        this.currentUser.set(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
}