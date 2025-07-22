import { Test, TestingModule } from '@nestjs/testing';
import { MealLogController } from './meal-log.controller';

describe('MealLogController', () => {
  let controller: MealLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealLogController],
    }).compile();

    controller = module.get<MealLogController>(MealLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
