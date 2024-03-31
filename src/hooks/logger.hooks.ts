import { Logger, RawBodyRequest } from '@nestjs/common';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { getModuleFileName } from 'src/utils/common.util';

const logger = new Logger(getModuleFileName(__filename));

export default function addLoggerHook(
  server: FastifyInstance
): FastifyInstance {
  return server.addHook(
    'onResponse',
    (request: RawBodyRequest<FastifyRequest>, response, next) => {
      if (request.url !== '/') {
        const { ip, method, url, headers, rawBody: body } = request;
        const { statusCode } = response;
        const protocol = request.headers['x-forwarded-proto'] || 'http';
        const fullUrl = `${protocol}://${headers.host}${url}`;
        logger.log(
          `method: ${method}, url: ${fullUrl}, statusCode: ${statusCode}, ip: ${ip}, content-type: ${
            headers['content-type']
          }, body: ${JSON.stringify(body?.toString()) || 'undefined'}`
        );
      }
      next();
    }
  );
}
