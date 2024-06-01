import { PartialType } from '@nestjs/swagger';
// import { CreatePetDto } from './create-pet.dto';
import { CreatePetMobileDto } from './create-pet-mobile.dto';

export class UpdatePetDto extends PartialType(CreatePetMobileDto) {}
