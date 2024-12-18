import { Test, TestingModule } from '@nestjs/testing';
import { HpService } from './hp.service';

describe('HpService', () => {
  let service: HpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HpService],
    }).compile();

    service = module.get<HpService>(HpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
