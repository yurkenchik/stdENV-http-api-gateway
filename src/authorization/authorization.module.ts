import {Module} from "@nestjs/common";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {AuthorizationResolver} from "./authorization.resolver";


@Module({
    providers: [AuthorizationResolver],
    imports: [NatsClientModule],
    exports: [AuthorizationResolver]
})
export class AuthorizationModule {}