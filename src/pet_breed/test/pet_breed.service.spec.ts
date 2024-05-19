import { Test, TestingModule } from '@nestjs/testing';
import { PetBreedService } from '../pet_breed.service';

describe('PetBreedService', () => {
  let service: PetBreedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetBreedService],
    }).compile();

    service = module.get<PetBreedService>(PetBreedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
