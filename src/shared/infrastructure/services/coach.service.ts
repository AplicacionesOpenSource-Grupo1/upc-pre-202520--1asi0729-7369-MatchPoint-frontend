import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coach } from '../../domain/models/coach.model';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/coaches';

  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.apiUrl);
  }

  getCoachById(id: string): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/${id}`);
  }

  searchCoaches(filters?: {
    sport?: string;
    location?: string;
    level?: string;
    minRating?: number;
    maxPrice?: number;
  }): Observable<Coach[]> {
    let params = new URLSearchParams();
    
    if (filters) {
      if (filters.sport && filters.sport !== 'all') {
        params.append('sports_like', filters.sport);
      }
      if (filters.location && filters.location !== 'any') {
        params.append('location_like', filters.location);
      }
      if (filters.level && filters.level !== 'all') {
        params.append('level', filters.level);
      }
      if (filters.minRating) {
        params.append('rating_gte', filters.minRating.toString());
      }
      if (filters.maxPrice) {
        params.append('pricePerHour_lte', filters.maxPrice.toString());
      }
    }

    const url = params.toString() ? `${this.apiUrl}?${params.toString()}` : this.apiUrl;
    return this.http.get<Coach[]>(url);
  }
}
