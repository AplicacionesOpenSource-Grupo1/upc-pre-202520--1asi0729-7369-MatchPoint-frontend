import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, User } from '../../domain/models/booking.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.configService.getApiUrl('bookings'));
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.configService.getApiUrl('bookings')}/${id}`);
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.configService.getApiUrl('bookings')}?userId=${userId}`);
  }

  createBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    return this.http.post<Booking>(this.configService.getApiUrl('bookings'), booking);
  }

  updateBooking(id: string, booking: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.configService.getApiUrl('bookings')}/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.configService.getApiUrl('bookings')}/${id}`);
  }
}
