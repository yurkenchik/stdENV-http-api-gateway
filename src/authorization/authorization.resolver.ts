import {
    BadRequestException,
    HttpException,
    Inject,
    Logger,
    UseFilters
} from "@nestjs/common";
import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {firstValueFrom} from "rxjs";
import { AuthenticationOutput } from "@studENV/shared/dist/outputs/authoirization/authentication.output";
import { RegistrationInput } from "@studENV/shared/dist/inputs/authorization/registration.input";
import { LoginInput } from "@studENV/shared/dist/inputs/authorization/login.input";
import {ClientProxy} from "@nestjs/microservices";
import { GraphQLError } from "graphql";

@Resolver()
export class AuthorizationResolver {

    private readonly logger = new Logger(AuthorizationResolver.name);
    
    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy,
    ) {}
    
    @Mutation(() => AuthenticationOutput)
    async registration(
        @Args('registrationInput') registrationInput: RegistrationInput
    ): Promise<AuthenticationOutput>
    {
        try {
            const result = await firstValueFrom(
                this.natsClient.send({ cmd: "registration" }, registrationInput)
            );
            return result;
        } catch (error) {
            this.logger.log(`Error during registration: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
            // throwHttpException(error);
        }
    }
    
    @Mutation(() => AuthenticationOutput)
    async login(
        @Args("loginInput") loginInput: LoginInput
    ): Promise<AuthenticationOutput>
    {
        try {
            const result = await firstValueFrom(
                this.natsClient.send({ cmd: "login" }, loginInput)
            );
            console.log("login result: ", result);
            return result;
        } catch (error) {
            this.logger.log(`Error during registration: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

}