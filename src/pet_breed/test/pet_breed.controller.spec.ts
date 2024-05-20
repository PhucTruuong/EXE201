import { Test, TestingModule } from '@nestjs/testing';
import { PetBreedController } from './pet_breed.controller';
import { PetBreedService } from './pet_breed.service';

describe('PetBreedController', () => {
  let controller: PetBreedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetBreedController],
      providers: [PetBreedService],
    }).compile();

    controller = module.get<PetBreedController>(PetBreedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
