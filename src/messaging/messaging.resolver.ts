import { HttpStatus, Logger } from '@nestjs/common';
import { SendVerificationCodeInput } from '@studENV/shared/dist/inputs/email/send-verification-code.input';
import { MessageOutput } from '@studENV/shared/dist/outputs/messages/message.output';
import { HttpException, Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Resolver()
export class MessagingResolver {

    private readonly logger = new Logger(MessagingResolver.name);

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

    @Mutation(() =>  MessageOutput)
    async sendVerificationCode(
        @Args("sendVerificationCodeInput") sendVerificationCodeInput: SendVerificationCodeInput
    ): Promise<MessageOutput>
    {
        try {
            const result = await firstValueFrom(
                this.natsClient.send({ cmd: "sendVerificationCodeEmail" }, sendVerificationCodeInput)
            );
            return result;
        } catch (error) {
            this.logger.log(`Error during sending verification code: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.status, error.message);
        }
    }

}
