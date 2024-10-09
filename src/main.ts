import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    await app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
}
bootstrap();
