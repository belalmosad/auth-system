import { Test, TestingModule } from '@nestjs/testing';
import { RolesManagementService } from '../../../src/roles-management/roles-management.service';

describe('RolesManagementService', () => {
  let service: RolesManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesManagementService],
    }).compile();

    service = module.get<RolesManagementService>(RolesManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
