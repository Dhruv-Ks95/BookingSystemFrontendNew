export interface Booking {
    bookingId: number;
    employeeId: number;
    bookingDate: Date;
    seatNumber: number;
}

export interface CreateBookingDTO {
    employeeId: number;
    bookingDate: Date;
    seatNumber: number;
}

export interface CancelBookingDTO {
    employeeId: number;
    bookingId: number;
}

export interface Seat {
    id: number;
    seatNumber: number;
    isAvailable: boolean;
}