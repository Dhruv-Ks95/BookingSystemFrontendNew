import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking, CancelBookingDTO, CreateBookingDTO } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl : './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css'
})

export class BookingCalendarComponent implements OnInit {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  calendarDays: Array<{
    date: Date;
    availableSeats: number;
    hasBooking: boolean;
    bookingId?: number;
  }> = [];
  selectedDates: Date[] = [];
  employeeId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.employeeId = user.employeeId;
        this.loadCalendarData();
      }
    });
  }

  ngOnInit() {
    this.loadCalendarData();
  }

  loadCalendarData() {
    if (!this.employeeId) return;

    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    this.bookingService.getUserBookings(this.employeeId).subscribe(bookings => {      
      this.generateCalendarDays(startDate, endDate, bookings);
    });
  }

  generateCalendarDays(startDate: Date, endDate: Date, bookings: Booking[]) {
    this.calendarDays = [];
    const currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      const booking = bookings.find(b => 
        new Date(b.bookingDate).toDateString() === currentDay.toDateString()
      );

      this.bookingService.getAvailableSeats(currentDay).subscribe(availableSeats => {
        this.calendarDays.push({
          date: new Date(currentDay),
          availableSeats,
          hasBooking: !!booking,
          bookingId: booking?.bookingId
        });
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }
    this.calendarDays.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  isValidBookingDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return date >= today && date <= thirtyDaysFromNow;
  }

  selectDate(date: Date) {
    const index = this.selectedDates.findIndex(d => 
      d.toDateString() === date.toDateString()
    );
    
    if (index === -1) {
      this.selectedDates.push(date);
    }
  }

  removeDate(date: Date) {
    this.selectedDates = this.selectedDates.filter(d => 
      d.toDateString() !== date.toDateString()
    );
  }

  async bookMultipleDates() {
    if (!this.employeeId) return;

    for (const date of this.selectedDates) {
      const bookingDTO: CreateBookingDTO = {
        employeeId: this.employeeId,
        bookingDate: date,
        seatNumber: 1 // You might want to add seat selection functionality
      };

      try {
        await this.bookingService.bookSeat(bookingDTO).toPromise();
      } catch (error) {
        console.error(`Failed to book for date ${date}:`, error);
      }
    }

    this.selectedDates = [];
    this.loadCalendarData();
  }

  cancelBooking(bookingId?: number) {
    if (!bookingId || !this.employeeId) return;

    if (confirm('Are you sure you want to cancel this booking?')) {
      const cancelDTO: CancelBookingDTO = {
        employeeId: this.employeeId,
        bookingId: bookingId
      };

      this.bookingService.cancelBooking(cancelDTO).subscribe({
        next: () => {
          this.loadCalendarData();
        },
        error: (error) => {
          console.error('Failed to cancel booking:', error);
        }
      });
    }
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.loadCalendarData();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.loadCalendarData();
  }
}
