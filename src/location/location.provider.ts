import { Location } from "src/database/dabaseModels/location.entity";


export const LocationProviders = [
    {
        provide: 'LOCATION_REPOSITORY',
        useValue: Location,
    },
];