import { City } from "src/database/dabaseModels/city.entity";


export const CityProviders = [
    {
        provide: 'CITY_REPOSITORY',
        useValue: City,
    },
];