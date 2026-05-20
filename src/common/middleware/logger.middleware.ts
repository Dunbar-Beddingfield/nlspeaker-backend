import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      const { statusCode } = res;
      const color =
        statusCode >= 500 ? '\x1b[31m'
        : statusCode >= 400 ? '\x1b[33m'
        : statusCode >= 300 ? '\x1b[36m'
        : '\x1b[32m';
      const reset = '\x1b[0m';

      this.logger.log(
        `${color}${method} ${originalUrl}${reset} → ${color}${statusCode}${reset} (${ms}ms) [${ip}]`,
      );
    });

    next();
  }
}
