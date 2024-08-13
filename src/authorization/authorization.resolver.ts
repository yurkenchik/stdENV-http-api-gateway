import {Body, Controller, Delete, Inject, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {RegistrationInput} from "./inputs/registration.input";
import {AuthenticationOutput} from "./outputs/authentication.output";
import {LoginInput} from "./inputs/login.input";

@Resolver()
export class AuthorizationResolver {
    
    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy,
    ) {}
    
    @Mutation(() => AuthenticationOutput)
    async registration(
        @Args('registrationInput') registrationInput: RegistrationInput
    ): Promise<AuthenticationOutput>
    {
        const result = await this.natsClient.send({ cmd: "registration" }, registrationInput).toPromise();
        console.log("registration result: ", result);
        return result;
    }
    
    @Mutation(() => AuthenticationOutput)
    async login(
        @Args("loginInput") loginInput: LoginInput
    ): Promise<AuthenticationOutput>
    {
        const result = await this.natsClient.send({ cmd: "login" }, loginInput).toPromise();
        console.log("login result: ", result);
        return result;
    }
    
}