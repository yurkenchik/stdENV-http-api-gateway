import {Query, Resolver} from "@nestjs/graphql";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {UserId} from "../decorators/user-id.decorator";
import {HttpException, Inject, Logger} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {Roles} from "../decorators/role.decorator";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

@Resolver()
export class UserResolver {

    private readonly logger = new Logger(UserResolver.name);

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

}