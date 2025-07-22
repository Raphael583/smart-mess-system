import { Test, TestingModule } from '@nestjs/testing';
import { WeeklyMenuService } from './weekly-menu.service';

describe('WeeklyMenuService', () => {
  let service: WeeklyMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeeklyMenuService],
    }).compile();

    service = module.get<WeeklyMenuService>(WeeklyMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
