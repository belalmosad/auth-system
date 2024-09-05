import { Body, Controller, Delete, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { RolesManagementService } from './roles-management.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleEntity } from './entities/role.entity';
import { AssignRoleDto } from './dtos/assign-role-dto';

@Controller('roles-management')
export class RolesManagementController {
    constructor(private rolesService: RolesManagementService) {}
    @Post('create')
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

    @Post('assign')
    async assignRole(@Body() assignRoleData: AssignRoleDto) {
        const assignedRole = await this.rolesService.assignRole(assignRoleData);
        return assignedRole;
    }
}
