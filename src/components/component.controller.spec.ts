import { Test, TestingModule } from '@nestjs/testing';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';

describe('ComponentController', () => {
  let controller: ComponentController;

  beforeEach(async () => {
    const mockComponentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentController],
      providers: [
        {
          provide: ComponentService,
          useValue: mockComponentService,
        },
      ],
    }).compile();

    controller = module.get<ComponentController>(ComponentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

