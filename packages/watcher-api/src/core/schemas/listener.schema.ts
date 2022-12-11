import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ListenerArchive,
  ListenerArchiveSchema,
} from './listener-archive.schema';
import { ListenerObserver } from './listener-observer.schema';

export type ListenerDocument = Listener & Document;

@Schema()
export class ListenerParams {
  @Prop({ type: String, required: false })
  query: string;
  @Prop({ type: String, required: false })
  actType?: string;
  @Prop({ type: String, required: false })
  mainOrganization?: string;
  @Prop({ type: String, required: false })
  subOrganization?: string;
}

@Schema()
export class LastScrapeResult {
  @Prop({ type: Number, required: true })
  totalResults: number;
  @Prop({ type: Number, required: true })
  updatedAt: number;
}

@Schema()
export class Listener {
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  createdAt: number;

  @Prop({ type: Number, required: false })
  updatedAt: number;

  @Prop({ type: Number, required: false })
  deletedAt: number;

  @Prop({ type: ListenerParams, required: true })
  params: ListenerParams;

  @Prop({ type: LastScrapeResult, required: false })
  lastScrape?: LastScrapeResult;

  @Prop({ type: [ListenerArchiveSchema] })
  listenerArchives: Array<ListenerArchive>;

  @Prop({
    type: [{ type: Types.ObjectId, ref: ListenerObserver.name }],
  })
  observers: Array<ListenerObserver>;

  @Prop({ type: Number, required: false })
  lastScrapeAt: number;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String, required: false })
  title: string;

  static addArchive(listener: Listener, archive: ListenerArchive) {
    listener.listenerArchives.push(archive);
    listener.updatedAt = Date.now();
  }

  static addObserver(listener: Listener, observer: ListenerObserver) {
    listener.observers.push(observer);
  }

  static updateLastScrape(listener: Listener, totalResults: number) {
    listener.lastScrape = {
      totalResults: totalResults,
      updatedAt: Date.now(),
    };
  }

  static hasObserver(listener: Listener, observer: ListenerObserver): boolean {
    return listener.observers.some((o) => o._id.equals(observer._id));
  }

  static lastListenerArchive(listener: Listener): ListenerArchive {
    return listener.listenerArchives.sort(
      (a, b) => b.createdAt - a.createdAt,
    )[0];
  }
}

export const ListenerSchema = SchemaFactory.createForClass(Listener);
