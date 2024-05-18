import { Role } from "src/database/dabaseModels/role.entity";

export const RoleProviders = [
    {
        provide: 'ROLE_REPOSITORY',
        useValue: Role,
    },
];