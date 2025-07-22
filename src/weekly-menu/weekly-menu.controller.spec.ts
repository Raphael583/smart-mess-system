import { Test, TestingModule } from '@nestjs/testing';
import { WeeklyMenuController } from './weekly-menu.controller';

describe('WeeklyMenuController', () => {
  let controller: WeeklyMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeeklyMenuController],
    }).compile();

    controller = module.get<WeeklyMenuController>(WeeklyMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
