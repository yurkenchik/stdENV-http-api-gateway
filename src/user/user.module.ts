import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {AuthorizationResolver} from "../authorization/authorization.resolver";
import {HttpExceptionService} from "@studENV/shared/dist/utils/exceptions-case";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {JwtModule} from "@nestjs/jwt";
import {UserResolver} from "./user.resolver";
import {Role} from "@studENV/shared/dist/entities/role.entity";

@Module({
    providers: [UserResolver, HttpExceptionService],
    imports: [
        NatsClientModule,
        TypeOrmModule.forFeature([User, Role]),
        JwtModule
    ],
    exports: [UserResolver]
})
export class UserModule {}