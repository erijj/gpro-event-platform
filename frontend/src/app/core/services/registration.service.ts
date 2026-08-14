import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly baseUrl = 'http://localhost:8080/api/registrations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.baseUrl);
  }

  getById(id: number): Observable<Registration> {
    return this.http.get<Registration>(`${this.baseUrl}/${id}`);
  }
}