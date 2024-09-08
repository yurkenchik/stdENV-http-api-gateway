import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {AuthorizationResolver} from "../authorization/authorization.resolver";
import {HttpExceptionService} from "@studENV/shared/dist/utils/exceptions-case";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {JwtModule} from "@nestjs/jwt";
import {UserResolver} from "./user.resolver";

@Module({
    providers: [UserResolver, HttpExceptionService],
    imports: [
        NatsClientModule, TypeOrmModule.forFeature([User]),
        JwtModule
    ],
    exports: [UserResolver]
})
export class UserModule {}