import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingDTO, CancelBookingDTO } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = 'https://localhost:7133/api';

  constructor(private http: HttpClient) {}

  getUserBookings(employeeId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/Booking/getBookings/${employeeId}`);
  }

  getAvailableSeats(date: Date): Observable<number> { // update
    return this.http.get<number>(`${this.API_URL}/Booking/getAvailableSeats/${date.toISOString()}`);
  }

  getBookingsForRange(startDate: Date, endDate: Date): Observable<Booking[]> { // update
    return this.http.get<Booking[]>(`${this.API_URL}/Booking/getBookingsForRange`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  bookSeat(booking: CreateBookingDTO): Observable<{ bookingId: number }> {
    return this.http.post<{ bookingId: number }>(`${this.API_URL}/Booking/addBooking`, booking);
  }

  cancelBooking(cancelDTO: CancelBookingDTO): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/Booking/cancelBooking`, { body: cancelDTO });
  }
}