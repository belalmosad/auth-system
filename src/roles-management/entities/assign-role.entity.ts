import { Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'user_roles'})
export class AssignRoleEntity {
    @PrimaryColumn()
    user_id: number;
    @PrimaryColumn()
    role_id: number;
}