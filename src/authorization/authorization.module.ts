import {Module} from "@nestjs/common";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {AuthorizationResolver} from "./authorization.resolver";
import { HttpExceptionService } from "@studENV/shared/dist/utils/exceptions-case";

@Module({
    providers: [AuthorizationResolver, HttpExceptionService],
    imports: [NatsClientModule],
    exports: [AuthorizationResolver]
})
export class AuthorizationModule {}