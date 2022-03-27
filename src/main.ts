import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asdfgh'], // @TODO: remove hardcoded key
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra properties on the request that don't match the dto
    }),
  );
  await app.listen(3000);
}
bootstrap();
