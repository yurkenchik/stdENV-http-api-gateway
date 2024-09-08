import {Module} from "@nestjs/common";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {AuthorizationResolver} from "./authorization.resolver";
import { HttpExceptionService } from "@studENV/shared/dist/utils/exceptions-case";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
    providers: [AuthorizationResolver, HttpExceptionService],
    imports: [
        NatsClientModule, TypeOrmModule.forFeature([User]),
        JwtModule
    ],
    exports: [AuthorizationResolver]
})
export class AuthorizationModule {}