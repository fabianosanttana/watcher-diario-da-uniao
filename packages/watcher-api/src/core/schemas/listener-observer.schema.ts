import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ListenerObserverDocument = ListenerObserver & Document;

@Schema()
export class ListenerObserver {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Number, required: true })
  createdAt: number;
}

export const ListenerObserverSchema =
  SchemaFactory.createForClass(ListenerObserver);
