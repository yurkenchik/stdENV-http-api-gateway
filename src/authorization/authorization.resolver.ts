import {HttpException, Inject, InternalServerErrorException, Logger} from "@nestjs/common";
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {firstValueFrom} from "rxjs";
import {AuthenticationOutput} from "@studENV/shared/dist/outputs/authoirization/authentication.output";
import {RegistrationInput} from "@studENV/shared/dist/inputs/authorization/registration.input";
import {LoginInput} from "@studENV/shared/dist/inputs/authorization/login.input";
import {ClientProxy} from "@nestjs/microservices";
import {User} from "@studENV/shared/dist/entities/user.entity";

@Resolver()
export class AuthorizationResolver {

    private readonly logger = new Logger(AuthorizationResolver.name);
    
    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy,
    ) {}

    @Mutation(() => User)
    async registration(
        @Args('registrationInput') registrationInput: RegistrationInput
    ): Promise<User>
    {
        try {
            return await firstValueFrom(
                this.natsClient.send({ cmd: "registration" }, registrationInput)
            );
        } catch (error) {
            this.logger.log(`Error during registration: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }
    
    @Mutation(() => AuthenticationOutput)
    async login(
        @Args("loginInput") loginInput: LoginInput
    ): Promise<AuthenticationOutput> {
        try {
            return await firstValueFrom(
                this.natsClient.send({ cmd: "login" }, loginInput)
            );
        } catch (error) {
            this.logger.log(`Error during login: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

    @Mutation(() => AuthenticationOutput)
    async verifyUserAccountViaEmail(
        @Args("email") email: string,
        @Args("verificationCode") verificationCode: string
    ): Promise<AuthenticationOutput>
    {
        try {
            return await firstValueFrom(
                this.natsClient.send({ cmd: "verifyUserAccountViaEmail" }, {
                    email: email,
                    verificationCode: verificationCode,
                })
            )
        } catch (error) {
            this.logger.log(`Error during verifying user account: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

}