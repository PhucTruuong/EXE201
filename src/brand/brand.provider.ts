import { Brand } from "src/database/dabaseModels/brand.entity";


export const BrandProviders = [
    {
        provide: 'BRAND_REPOSITORY',
        useValue: Brand,
    },
];