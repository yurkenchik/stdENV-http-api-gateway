import { HttpException, Inject, InternalServerErrorException, Logger } from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {RegistrationInput} from "./inputs/registration.input";
import {AuthenticationOutput} from "./outputs/authentication.output";
import {LoginInput} from "./inputs/login.input";
import { firstValueFrom } from "rxjs";

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
            const result = await firstValueFrom(this.natsClient.send({ cmd: "registration" }, registrationInput));
            console.log("registration result: ", result);
            return result;
        } catch (error) {
            if (error instanceof HttpException) {
                this.logger.log(error.message);
                throw error;
            };
            throw new InternalServerErrorException(error.message);
        }
    }
    
    @Mutation(() => AuthenticationOutput)
    async login(
        @Args("loginInput") loginInput: LoginInput
    ): Promise<AuthenticationOutput>
    {
        const result = await firstValueFrom(this.natsClient.send({ cmd: "login" }, loginInput));
        console.log("login result: ", result);
        return result;
    }
    
}