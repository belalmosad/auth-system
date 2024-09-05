import { IsNumber } from "class-validator";

export class AssignRoleDto {
    @IsNumber()
    role_id: number;
    @IsNumber()
    user_id: number;
}