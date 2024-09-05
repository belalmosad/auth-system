import { Test, TestingModule } from '@nestjs/testing';
import { RolesManagementController } from '../../../src/roles-management/roles-management.controller';

describe('RolesManagementController', () => {
  let controller: RolesManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesManagementController],
    }).compile();

    controller = module.get<RolesManagementController>(RolesManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
