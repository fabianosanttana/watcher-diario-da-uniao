import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Listener, ListenerSchema } from 'src/core/schemas/listener.schema';
import { TasksService } from './tasks.service';
import { CrawlerService } from 'src/services/crawler.service';
import {
  ListenerNotification,
  ListenerNotificationSchema,
} from 'src/core/schemas/listener-notification.schema';
import { NotificationService } from 'src/services/notification.service';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [TasksService, CrawlerService, NotificationService],
  imports: [
    MongooseModule.forFeature([
      { name: Listener.name, schema: ListenerSchema },
      { name: ListenerNotification.name, schema: ListenerNotificationSchema },
    ]),
    MailModule,
  ],
  exports: [TasksService],
})
export class TasksModule {}
