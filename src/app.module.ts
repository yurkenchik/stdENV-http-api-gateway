import {Module} from '@nestjs/common';
import {AuthorizationModule} from "./authorization/authorization.module";
import {NatsClientModule} from "./nats-client/nats-client.module";
import {GraphQLModule} from "@nestjs/graphql";
import {TypeOrmModule} from "@nestjs/typeorm";
import {dataSourceOptions} from "./typeorm/typeorm.config";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {AppResolver} from "./app.resolver";

@Module({
  controllers: [],
  providers: [AppResolver],
  imports: [
    NatsClientModule,
    AuthorizationModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
    })
  ],
  exports: [
    GraphQLModule,
    TypeOrmModule
  ]
})
export class AppModule {}