import {Query, Resolver} from "@nestjs/graphql";

@Resolver()
export class AppResolver {
    
    @Query(() => String)
    checkServer(): string
    {
        return "Server is running..."
    }
    
}