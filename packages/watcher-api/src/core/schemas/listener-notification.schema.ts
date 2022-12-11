import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ListenerArchive } from './listener-archive.schema';
import { ListenerObserver } from './listener-observer.schema';
import { Listener } from './listener.schema';

export type ListenerNotificationDocument = ListenerNotification & Document;

@Schema()
export class ListenerNotification {
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: Number, required: true })
  createdAt: number;

  @Prop({ type: Boolean, required: false })
  isSent: boolean;

  @Prop({ type: Types.ObjectId, ref: ListenerObserver.name })
  observer: ListenerObserver;

  static create(
    title: string,
    description: string,
    url: string,
    observer: ListenerObserver,
  ): ListenerNotification {
    return {
      title: title,
      description: description,
      url: url,
      createdAt: Date.now(),
      isSent: false,
      observer: observer,
    };
  }

  static sentNotification(notification: ListenerNotification) {
    notification.isSent = true;
  }
}

export const ListenerNotificationSchema =
  SchemaFactory.createForClass(ListenerNotification);
