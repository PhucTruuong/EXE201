import { User } from "src/database/dabaseModels/user.entity";

export const UserProviders = [
    {
        provide: 'USER_REPOSITORY',
        useValue: User,
    },
];