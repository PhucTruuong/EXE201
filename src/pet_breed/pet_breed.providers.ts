import { PetBreed } from "src/database/dabaseModels/pet_breed.entity";


export const PetBreedProviders = [
    {
        provide: 'PET_BREED_REPOSITORY',
        useValue: PetBreed,
    },
];