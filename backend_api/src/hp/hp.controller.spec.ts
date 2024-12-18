import { Test, TestingModule } from '@nestjs/testing';
import { HpController } from './hp.controller';

describe('HpController', () => {
  let controller: HpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HpController],
    }).compile();

    controller = module.get<HpController>(HpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
