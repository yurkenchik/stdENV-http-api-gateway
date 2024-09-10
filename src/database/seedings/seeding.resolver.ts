import {Query, Resolver} from "@nestjs/graphql";
import {ClientProxy, Payload} from "@nestjs/microservices";
import {HttpException, Inject, Logger} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {SeedingOutput} from "@studENV/shared/dist/outputs/seeding/seeding.output";

@Resolver()
export class SeedingResolver {

    private readonly logger = new Logger(SeedingResolver.name);

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

    @Query(() => SeedingOutput)
    async seedUsers(): Promise<SeedingOutput>
    {
        try {
            const usersSeedingResult = await firstValueFrom(
                this.natsClient.send({ cmd: "seedUsers" }, {})
            );
            console.log("USERS SEEDING RESULT: ", usersSeedingResult);
            return usersSeedingResult;
        } catch (error) {
            this.logger.log(`Error seeding users: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

    @Query(() => SeedingOutput)
    async seedRoles(): Promise<SeedingOutput>
    {
        try {
            const rolesSeedingResult = await firstValueFrom(
                this.natsClient.send({ cmd: "seedRoles" }, {})
            );
            return rolesSeedingResult;
        } catch (error) {
            this.logger.log(`Error seeding roles: ${error.message}, status code: ${error.statusCode}`);
            throw new HttpException(error.message, error.statusCode);
        }
    }

}