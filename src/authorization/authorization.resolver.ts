import {
    BadRequestException,
    HttpException,
    Inject,
    InternalServerErrorException,
    Logger,
    UseFilters
} from "@nestjs/common";
import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {catchError, firstValueFrom, throwError} from "rxjs";
import {GraphqlExceptionFilter} from "@studENV/shared/dist/filters/graphql-exception.filter";
import { AuthenticationOutput } from "@studENV/shared/dist/outputs/authoirization/authentication.output"
import { RegistrationInput } from "@studENV/shared/dist/inputs/authorization/registration.input"
import { LoginInput } from "@studENV/shared/dist/inputs/authorization/login.input"
import {ClientProxy, RpcException} from "@nestjs/microservices";

@Resolver()
@UseFilters(new GraphqlExceptionFilter())
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
            if (error instanceof HttpException) {
                throw error;
            }
            if (error instanceof RpcException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    
    @Mutation(() => AuthenticationOutput)
    async login(
        @Args("loginInput") loginInput: LoginInput
    ): Promise<AuthenticationOutput>
    {
        const result = await firstValueFrom(
            this.natsClient.send({ cmd: "login" }, loginInput)
        );
        console.log("login result: ", result);
        return result;
    }

}