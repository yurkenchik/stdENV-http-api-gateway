import {Args, Query, Resolver} from "@nestjs/graphql";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {UserId} from "../decorators/user-id.decorator";
import {HttpException, Inject, Logger, UseGuards} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {Roles} from "../decorators/role.decorator";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";
import {FilterOptionsInput} from "@studENV/shared/dist/inputs/common/filter-options.input"
import {RoleGuard} from "../guards/role.guard";
import {AuthGuard} from "../guards/auth.guard";

@Resolver()
export class UserResolver {

    private readonly logger = new Logger(UserResolver.name);

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(RoleEnum.ADMIN)
    @Query(() => [User])
    async getUsers(
        @Args("filterOptionsInput", { nullable: true }) filterOptionsInput?: FilterOptionsInput
    ): Promise<Array<User>> {
        try {
            return await firstValueFrom(
                this.natsClient.send({ cmd: "getUsers" }, { filterOptionsInput })
            ) ?? [];
        } catch (error) {
            this.logger.log(`Error getting users: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

}