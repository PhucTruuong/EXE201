import { Notification } from "src/database/dabaseModels/notification.entity";


export const NotificationProviders = [
    {
        provide: 'NOTIFICATION_REPOSITORY',
        useValue: Notification,
    },
];