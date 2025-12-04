import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Coach } from '../../domain/models/coach.model';
import { Page } from '../../../shared/domain/models/page.model';
import { ConfigService } from '../../../shared/infrastructure/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Page<Coach>>(`${this.configService.getApiUrl('coaches')}?size=100`).pipe(
      map(page => page.content)
    );
  }

  getCoachById(id: string): Observable<Coach> {
    return this.http.get<Coach>(`${this.configService.getApiUrl('coaches')}/${id}`);
  }

  searchCoaches(filters?: {
    sport?: string;
    location?: string;
    level?: string;
    minRating?: number;
    maxPrice?: number;
  }): Observable<Coach[]> {
    let params = new URLSearchParams();
    params.append('size', '100'); // Fetch enough items

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

    const baseUrl = this.configService.getApiUrl('coaches');
    const url = `${baseUrl}?${params.toString()}`;
    return this.http.get<Page<Coach>>(url).pipe(
      map(page => page.content)
    );
  }

  getAvailableCourtsForCoach(coachId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.configService.getApiUrl('coaches')}/${coachId}/courts`);
  }
}
