import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { join } from 'path';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.useStaticAssets(join(process.cwd(), 'public'), {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      'https://nlspeaker.com',
      'https://www.nlspeaker.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 4001;
  await app.listen(port);
  console.log(`NL Speaker API running on port ${port}`);

  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    const PING_INTERVAL_MS = 10 * 60 * 1000;
    setInterval(async () => {
      try {
        const res = await fetch(`${selfUrl}/v1/health`);
        console.log(`[keep-alive] ping → ${res.status}`);
      } catch (err) {
        console.warn('[keep-alive] ping failed:', err);
      }
    }, PING_INTERVAL_MS);
    console.log(`[keep-alive] self-ping active → ${selfUrl}/v1/health every 10 min`);
  }
}

bootstrap();
