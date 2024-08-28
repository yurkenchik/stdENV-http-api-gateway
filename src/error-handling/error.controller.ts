import {Controller, HttpException, Inject, Logger, OnModuleInit} from "@nestjs/common";
import {ClientProxy, EventPattern, Payload} from "@nestjs/microservices";

@Controller()
export class ErrorController implements OnModuleInit {

    private readonly logger = new Logger(ErrorController.name);

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

    async onModuleInit() 
    {
        await this.natsClient.connect();
        this.logger.log("NATS CLIENT CONNECTED!");
    }

}