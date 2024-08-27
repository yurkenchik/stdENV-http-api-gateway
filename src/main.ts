import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";
import {GraphqlExceptionFilter} from "@studENV/shared/dist/filters/graphql-exception.filter";
import {HttpExceptionFilter} from "@studENV/shared/dist/filters/http-exception.filter";

async function bootstrap()
{
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
}
bootstrap();
