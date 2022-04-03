// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import { ValidationPipe } from '@nestjs/common';

export const setupApp = (app: any) => {
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
};
