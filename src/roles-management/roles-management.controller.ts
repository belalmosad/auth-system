import { Body, Controller, Delete, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { RolesManagementService } from './roles-management.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleEntity } from './entities/role.entity';

@Controller('roles-management')
export class RolesManagementController {
    constructor(private rolesService: RolesManagementService) {}
    @Post()
    async createRole(@Body() rolesData: CreateRoleDto) {
        const createdRole = await this.rolesService.createRole(rolesData as Partial<RoleEntity>);
        return createdRole;
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string) {
        const idNumber = parseInt(id);
        const deleteRole = await this.rolesService.deleteRole(idNumber);
        if(!deleteRole) {
            throw new InternalServerErrorException('Something went wrong');
        }
        return deleteRole;
    }   
}
