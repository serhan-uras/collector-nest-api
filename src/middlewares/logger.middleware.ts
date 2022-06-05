import { Logger } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as os from 'os';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('HttpLogs');
    const startAt = process.hrtime();

    const { ip, method, originalUrl: url } = req;
    const hostname = os.hostname();
    const userAgent = req.get('user-agent') || '';
    const requestBody = req.body;

    res.on('close', () => {
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      logger.log(
        `[${hostname}] "${method} ${url}" ${statusCode} ${statusMessage} ${responseTime}ms ${contentLength} "${userAgent}" "${ip}" "${JSON.stringify(
          requestBody,
        )}"`,
      );
    });
    next();
  }
}
