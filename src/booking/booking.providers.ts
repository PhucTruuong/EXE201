import { Booking } from "src/database/dabaseModels/booking.entity";


export const BookingProviders = [
    {
        provide: 'BOOKING_REPOSITORY',
        useValue: Booking,
    },
];