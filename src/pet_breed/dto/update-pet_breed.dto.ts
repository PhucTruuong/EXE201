import { PartialType } from '@nestjs/swagger';
import { CreatePetBreedDto } from './create-pet_breed.dto';

export class UpdatePetBreedDto extends PartialType(CreatePetBreedDto) {}
