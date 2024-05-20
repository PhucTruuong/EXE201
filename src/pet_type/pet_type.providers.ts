import { PetType } from "src/database/dabaseModels/pet_type.entity";


export const PetTypeProviders = [
    {
        provide: 'PET_TYPE_REPOSITORY',
        useValue: PetType,
    },
];