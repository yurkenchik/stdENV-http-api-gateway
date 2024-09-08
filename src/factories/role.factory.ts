import {define} from "typeorm-seeding";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

define(Role, (faker, context: { roleType: RoleEnum }) => {
    const role = new Role();
    role.role = context.roleType;
    return role;
})