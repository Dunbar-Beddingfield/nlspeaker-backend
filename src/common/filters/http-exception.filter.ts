import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ method: string; url: string }>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `[${request.method} ${request.url}] ${(exception as Error)?.message ?? exception}`,
        (exception as Error)?.stack,
      );
    }

    const error =
      typeof rawMessage === 'string'
        ? rawMessage
        : (rawMessage as { message: string | string[] }).message;

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
