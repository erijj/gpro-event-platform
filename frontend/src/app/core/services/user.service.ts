import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(data: { nom: string; prenom: string; email: string; password: string; role: string }): Observable<User> {
  return this.http.post<User>(this.baseUrl, data);
  }

  update(id: number, data: { nom: string; prenom: string; email: string; role: string }): Observable<User> {
  return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}