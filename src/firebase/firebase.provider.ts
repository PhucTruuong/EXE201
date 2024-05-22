import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as serviceAccount from '../../petcare-6a561-firebase-adminsdk-1ctgv-f41da1d8c8.json';

export const firebaseProviders: Provider[] = [
    {
        provide: 'FIREBASE_ADMIN',
        useFactory: () => {
            const app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: 'gs://petcare-6a561.appspot.com',
            });
            return app;
        },
    },
    {
        provide: 'FIREBASE_STORAGE',
        useFactory: (firebaseApp: admin.app.App) => {
            return getStorage(firebaseApp).bucket();
        },
        inject: ['FIREBASE_ADMIN'],
    },
];