import { Category } from "src/database/dabaseModels/category.entity";


export const CategoryProviders = [
    {
        provide: 'CATEGORY_REPOSITORY',
        useValue: Category,
    },
];