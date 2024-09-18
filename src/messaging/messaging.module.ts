import { NatsClientModule } from '@studENV/shared/dist/nats-client/nats-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessagingResolver } from './messaging.resolver';

@Module({
    providers: [MessagingResolver],
    controllers: [],
    imports: [
        NatsClientModule
    ],
    exports: [MessagingResolver]
})
export class MessagingModule {}
