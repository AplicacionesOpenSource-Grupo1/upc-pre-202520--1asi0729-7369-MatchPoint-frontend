import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, of, forkJoin } from 'rxjs';
import { Coach } from '../../domain/models/coach.model';
import { ConfigService } from '../../../shared/infrastructure/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.configService.getApiUrl('coaches'));
  }

  getCoachById(id: string): Observable<Coach> {
    // Primero intentar obtener desde el archivo individual
    return this.http.get<Coach>(`${this.configService.getApiUrl('coaches')}-${id}.json`).pipe(
      catchError(() => {
        // Si falla, obtener desde la lista completa
        console.log(`Individual coach file not found for ID ${id}, fetching from complete list`);
        return this.getAllCoaches().pipe(
          map((coaches: Coach[]) => {
            const coach = coaches.find((c: Coach) => c.id === id);
            if (!coach) {
              throw new Error(`Coach with ID ${id} not found`);
            }
            return coach;
          })
        );
      })
    );
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

    const baseUrl = this.configService.getApiUrl('coaches');
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    return this.http.get<Coach[]>(url);
  }

  getAvailableCourtsForCoach(coachId: string): Observable<any[]> {
    return this.getCoachById(coachId).pipe(
      map(coach => coach.availableCourts || []),
      switchMap(courtIds => {
        if (courtIds.length === 0) {
          return of([]);
        }
        
        // Obtener las canchas por sus IDs
        const courtRequests = courtIds.map(id => 
          this.http.get<any>(`${this.configService.getApiUrl('courts')}/${id}`).pipe(
            catchError(() => of(null))
          )
        );
        
        return forkJoin(courtRequests).pipe(
          map(courts => courts.filter(court => court !== null))
        );
      })
    );
  }
}
