import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Archive, ArchiveSchema } from './archive.schema';

@Schema()
export class ListenerArchive {
  _id?: Types.ObjectId;

  @Prop({ type: Number, required: true })
  createdAt: number;

  @Prop({ type: Number, required: true })
  totalResults: number;

  @Prop([{ type: ArchiveSchema }])
  archives: Array<Archive>;

  static create(archives: Array<Archive>, totalResults: number): ListenerArchive {
    return {
      archives: archives,
      totalResults: totalResults,
      createdAt: Date.now(),
    };
  }
}

export const ListenerArchiveSchema =
  SchemaFactory.createForClass(ListenerArchive);
