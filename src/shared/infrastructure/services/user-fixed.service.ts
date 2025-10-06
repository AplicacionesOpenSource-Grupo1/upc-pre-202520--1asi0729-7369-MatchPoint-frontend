import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats, Activity } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002';

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/1`);
  }

  getUserStats(userId: string): Observable<UserStats> {
    // For now, return mock stats since we don't have a dedicated endpoint
    return new Observable(observer => {
      observer.next({
        totalBookings: 25,
        hoursPlayed: 32,
        favoriteSport: 'Tennis'
      });
      observer.complete();
    });
  }

  getUserActivities(userId: string): Observable<Activity[]> {
    // For now, return mock activities since we don't have a dedicated endpoint
    return new Observable(observer => {
      observer.next([
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmation',
          description: 'Booked a tennis court at Central Park Courts',
          date: new Date(),
          icon: 'check'
        },
        {
          id: '2',
          type: 'match',
          title: 'Match Completed',
          description: 'Played a tennis match at Central Park Courts',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: 'play'
        }
      ]);
      observer.complete();
    });
  }
}
