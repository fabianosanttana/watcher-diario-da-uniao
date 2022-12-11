import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { ListenerArchive } from 'src/core/schemas/listener-archive.schema';
import {
  ListenerNotification,
  ListenerNotificationDocument,
} from 'src/core/schemas/listener-notification.schema';
import { ListenerObserver } from 'src/core/schemas/listener-observer.schema';
import { Listener } from 'src/core/schemas/listener.schema';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(ListenerNotification.name)
    private readonly listenerNotificationModel: Model<ListenerNotificationDocument>,
    private readonly mailService: MailService,
  ) {}

  async createNotification(
    observer: ListenerObserver,
    listener: Listener,
    listenerArchive: ListenerArchive,
  ): Promise<void> {
    const { title, _id, url } = listener;
    const { totalResults } = listenerArchive;

    this.logger.debug(`Creating listener notification for listener id: ${_id}`);

    const notification = ListenerNotification.create(
      `Nova atualização na consulta: ${title || 'Sem título'}`,
      `A consulta ${title || 'Sem título'} 
      foi atualizada e agora possui ${totalResults} resultados.
      \nClique no botão abaixo para acessar o conteúdo.`,
      url,
      observer,
    );

    const listenerNotification = new this.listenerNotificationModel({
      ...notification,
    });

    await listenerNotification.save();
  }

  private async getPendingNotifications(): Promise<ListenerNotification[]> {
    return await this.listenerNotificationModel
      .find({ isSent: false })
      .populate('observer')
      .exec();
  }

  private async sendNotification(notification: ListenerNotification) {
    this.logger.debug(`Sending notification to ${notification.observer.email}`);
    try {
      await this.mailService.sendMail(
        notification.observer.email,
        notification.title,
        notification.description,
        notification.url,
      );

      ListenerNotification.sentNotification(notification);
      await this.listenerNotificationModel.findByIdAndUpdate(
        notification._id,
        notification,
      );
    } catch (error) {
      this.logger.error(
        `An error ocurred while sending notification to ${notification.observer.email}`,
      );
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendPendingNotifications() {
    const pendingNotifications = await this.getPendingNotifications();

    pendingNotifications.forEach(async (notification) => {
      await this.sendNotification(notification);
    });
  }
}
