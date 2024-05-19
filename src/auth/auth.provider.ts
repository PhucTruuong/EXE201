import { User } from "src/database/dabaseModels/user.entity";

export const AuthProviders = [
    {
        provide: 'AUTH_REPOSITORY',
        useValue: User,
    },
];