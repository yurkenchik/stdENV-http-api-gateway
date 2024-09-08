import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

export class CreateRolesSeed implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<void>
    {
        await Promise.all(
            Object.values(RoleEnum).map((role: RoleEnum) => {
                factory(Role)({ roleType: role }).create();
            })
        )
    }

}