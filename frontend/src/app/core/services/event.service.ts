import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }
  create(event: {
    titre: string;
    description: string;
    dateHeure: string;
    lieu: string;
    capaciteMax: number;
    categoryId: number;
    image?: string | null;
  }): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
 }
 update(id: number, event: {
  titre: string;
  description: string;
  dateHeure: string;
  lieu: string;
  capaciteMax: number;
  categoryId: number;
  image?: string | null;
}): Observable<Event> {
  return this.http.put<Event>(`${this.baseUrl}/${id}`, event);
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}