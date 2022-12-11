import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class Archive {
  @Prop({ type: Number, required: true })
  createdAt: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  publishedAt: string;

  @Prop({ type: String, required: true })
  smallContent: string;

  @Prop({ type: String, required: true })
  url: string;

  static create(
    title: string,
    url: string,
    smallContent: string,
    publishedAt: string,
  ): Archive {
    return {
      createdAt: Date.now(),
      title: title,
      url: url,
      smallContent: smallContent,
      publishedAt: publishedAt,
    };
  }
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
