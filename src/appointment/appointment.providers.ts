import { Appointment } from "src/database/dabaseModels/appointment.entity";


export const AppointmentProviders = [
    {
        provide: 'APPOINTMENT_REPOSITORY',
        useValue: Appointment,
    },
];