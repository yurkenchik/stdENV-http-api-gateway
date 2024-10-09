import { Transport } from '@nestjs/microservices';
import {Module} from '@nestjs/common';
import {AuthorizationModule} from "./authorization/authorization.module";
import {GraphQLModule} from "@nestjs/graphql";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {AppResolver} from "./app.resolver";
import {DataSourceOptions} from "typeorm";
import { ClientsModule } from '@nestjs/microservices';
import { ErrorController } from './error-handling/error.controller';
import {APP_FILTER} from "@nestjs/core";
import { GraphqlExceptionFilter } from './filters/graphql-exception.filter';
import {UserModule} from "./user/user.module";
import {dataSourceOptions} from "./database/typeorm/typeorm.config";
import {SeedingResolver} from "./database/seedings/seeding.resolver";
import { MessagingModule } from './messaging/messaging.module';
import {CertificateModule} from "./certificate/certificate.module";

@Module({
  controllers: [ErrorController],
  providers: [
      AppResolver,
      {
          provide: APP_FILTER,
          useClass: GraphqlExceptionFilter
      },
      SeedingResolver
  ],
  imports: [
    AuthorizationModule,
      UserModule,
    ClientsModule.register([
      {
        name: "NATS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"]
        }
      }
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions as DataSourceOptions
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      csrfPrevention: false,
      context: ({ req }) => ({ req }),
    }),
    MessagingModule,
    CertificateModule,
  ],
  exports: [
    GraphQLModule,
    TypeOrmModule
  ]
})
export class AppModule {}