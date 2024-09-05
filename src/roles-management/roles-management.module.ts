import { Module } from '@nestjs/common';
import { RolesManagementService } from './roles-management.service';
import { RolesManagementController } from './roles-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesManagementService],
  controllers: [RolesManagementController]
})
export class RolesManagementModule {}
