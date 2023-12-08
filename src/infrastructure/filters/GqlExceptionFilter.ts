import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter as NestGqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class GqlExceptionFilter implements NestGqlExceptionFilter {
  // catch(exception: HttpException, host: ArgumentsHost) {
  //   // const _gqlHost = GqlArgumentsHost.create(host);

  //   const ctx = host.switchToHttp();
  //   const response = ctx.getResponse<Response>();
  //   const request = ctx.getRequest<Request>();

  //   const status = exception.getStatus();

  //   response.status(status).json({
  //     statusCode: status,
  //     message: exception.message,
  //     timestamp: new Date().toISOString(),
  //     path: request.url,
  //   });
  // }

  catch(exception: HttpException /*, host: ArgumentsHost */) {
    // const _gqlHost = GqlArgumentsHost.create(host);
    return exception;
  }
}
