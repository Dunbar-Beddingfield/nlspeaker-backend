import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { UploadModule } from './upload/upload.module.js';
import { SiteSettingsModule } from './site-settings/site-settings.module.js';
import { ServicesModule } from './services/services.module.js';
import { TopicsModule } from './topics/topics.module.js';
import { EventsModule } from './events/events.module.js';
import { TestimonialsModule } from './testimonials/testimonials.module.js';
import { MediaModule } from './media/media.module.js';
import { BlogModule } from './blog/blog.module.js';
import { InquiriesModule } from './inquiries/inquiries.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    AdminModule,
    UploadModule,
    SiteSettingsModule,
    ServicesModule,
    TopicsModule,
    EventsModule,
    TestimonialsModule,
    MediaModule,
    BlogModule,
    InquiriesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
