import { Test, TestingModule } from '@nestjs/testing';
import { MealLogService } from './meal-log.service';

describe('MealLogService', () => {
  let service: MealLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealLogService],
    }).compile();

    service = module.get<MealLogService>(MealLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
