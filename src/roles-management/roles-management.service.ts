import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { AssignRoleEntity } from './entities/assign-role.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RolesManagementService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(AssignRoleEntity) private assignRoleRepo: Repository<AssignRoleEntity>,
    private usersService: UsersService
  ) {}

  async createRole(role: Partial<RoleEntity>) {
    const roleCreated = this.roleRepo.create(role);
    return await this.roleRepo.save(roleCreated);
  }

  async findRole(id: number) {
    const role = await this.roleRepo.findOneBy({id});
    return role;
  }

  async deleteRole(id: number) {
    const role = await this.roleRepo.findOneBy({id});
    if(!role) {
        throw new NotFoundException('Role does not exist');
    }
    return await this.roleRepo.remove(role);
  }

  async assignRole(assignRoleData: AssignRoleEntity) {
    const role = await this.findRole(assignRoleData.role_id);
    const user = await this.usersService.getUserById(assignRoleData.user_id);
    if(!role) {
        throw new NotFoundException('No role found');
    }
    if(!user) {
        throw new NotFoundException('No user found');
    }
    const created = this.assignRoleRepo.create(assignRoleData);
    await this.assignRoleRepo.save(created);
  }
   
}
