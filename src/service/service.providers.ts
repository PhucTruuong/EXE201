import { Service } from "src/database/dabaseModels/service.entity";


export const ServiceProviders = [
    {
        provide: 'SERVICE_REPOSITORY',
        useValue: Service,
    },
];