import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesManagementService {
  constructor(
    @InjectRepository(RoleEntity) private repo: Repository<RoleEntity>,
  ) {}

  async createRole(role: Partial<RoleEntity>) {
    const roleCreated = this.repo.create(role);
    return await this.repo.save(roleCreated);
  }

  async findRole(id: number) {
    const role = await this.repo.findOneBy({id});
    return role;
  }

  async deleteRole(id: number) {
    const role = await this.repo.findOneBy({id});
    if(!role) {
        throw new NotFoundException('Role does not exist');
    }
    return await this.repo.remove(role);
  }
   
}
