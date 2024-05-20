import { Pet } from "src/database/dabaseModels/pet.entity";


export const PetProviders = [
    {
        provide: 'PET_REPOSITORY',
        useValue: Pet,
    },
];