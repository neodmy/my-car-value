import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// The decorator doesn't exist outside the DI, cannot access the UsersService
// We need an Interceptor for that and communicate it with the decorator
export const CurrentUser = createParamDecorator(
  // ExecutionContext -> wrapper over the request
  // data -> argument provided to the decorator
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
