import {Module} from "@nestjs/common";
import {CertificateResolver} from "./certificate.resolver";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";

@Module({
    providers: [CertificateResolver],
    imports: [NatsClientModule],
    exports: [CertificateResolver]
})
export class CertificateModule {}