import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import {
  ListenerNotification,
  ListenerNotificationSchema,
} from './core/schemas/listener-notification.schema';
import {
  ListenerObserver,
  ListenerObserverSchema,
} from './core/schemas/listener-observer.schema';
import { Listener, ListenerSchema } from './core/schemas/listener.schema';
import { CrawlerService } from './services/crawler.service';
import { ListenerService } from './services/listener.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      user: process.env.MONGO_ROOT_USER,
      pass: process.env.MONGO_ROOT_PASSWORD,
      dbName: process.env.DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: Listener.name, schema: ListenerSchema },
      { name: ListenerObserver.name, schema: ListenerObserverSchema },
      { name: ListenerNotification.name, schema: ListenerNotificationSchema },
    ]),
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    CrawlerService,
    ListenerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
