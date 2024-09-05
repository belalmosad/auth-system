import { Module } from '@nestjs/common';
import { RolesManagementService } from './roles-management.service';
import { RolesManagementController } from './roles-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { AssignRoleEntity } from './entities/assign-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, AssignRoleEntity]), UsersModule],
  providers: [RolesManagementService],
  controllers: [RolesManagementController]
})
export class RolesManagementModule {}
