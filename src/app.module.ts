import {Module} from '@nestjs/common';
import {AuthorizationModule} from "./authorization/authorization.module";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {GraphQLModule} from "@nestjs/graphql";
import {TypeOrmModule} from "@nestjs/typeorm";
import {dataSourceOptions} from "@studENV/shared/dist/typeorm/typeorm.config";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {AppResolver} from "./app.resolver";
import {DataSourceOptions} from "typeorm";

@Module({
  controllers: [],
  providers: [AppResolver],
  imports: [
    NatsClientModule,
    AuthorizationModule,
    TypeOrmModule.forRoot(dataSourceOptions as DataSourceOptions),
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