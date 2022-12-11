import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ListenerObserver,
  ListenerObserverDocument,
} from 'src/core/schemas/listener-observer.schema';
import { Listener, ListenerDocument } from 'src/core/schemas/listener.schema';
import { bindListenerUrl } from 'src/core/utils/query.utils';
import { CreateListenerDto } from 'src/dtos/create.listener.dto';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Injectable()
export class ListenerService {
  private readonly logger = new Logger(ListenerService.name);

  constructor(
    @InjectModel(Listener.name)
    private readonly listenerModel: Model<ListenerDocument>,
    private readonly taskService: TasksService,
    @InjectModel(ListenerObserver.name)
    private readonly listenerObserverModel: Model<ListenerObserverDocument>,
  ) {}

  async createListener(createListener: CreateListenerDto): Promise<Listener> {
    this.logger.debug(`Creating listener: ${createListener.query}`);
    const { title } = createListener;

    const listener = new this.listenerModel({
      params: createListener,
      createdAt: Date.now(),
      url: bindListenerUrl(createListener),
      title: title,
    });

    var result = await listener.save();

    await this.scrape(result._id);

    return result;
  }

  async subscribe(
    listenerId: string,
    email: string,
  ): Promise<ListenerObserver> {
    const listener = await this.getListener(listenerId);
    const observer = await this.getOrCreateObserverByEmail(email);

    if (Listener.hasObserver(listener, observer)) return observer;

    Listener.addObserver(listener, observer);

    await this.listenerModel.findOneAndUpdate(listener._id, listener).exec();

    return observer;
  }

  private async getOrCreateObserverByEmail(
    email: string,
  ): Promise<ListenerObserver> {
    let observer = await this.listenerObserverModel.findOne({
      email: email,
    });

    if (!observer) {
      observer = new this.listenerObserverModel({
        email,
        createdAt: Date.now(),
      });

      observer = await observer.save();
    }

    return observer;
  }

  // TODO: implement this in future
  async unsubscrive(listenerId: string, email: string) {
    throw new Error('Not implemented');
  }

  async getListeners(): Promise<Listener[]> {
    return await this.listenerModel
      .find()
      .populate('observers')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getListener(id: string): Promise<Listener> {
    return await await this.listenerModel
      .findById(id)
      .populate('listenerArchives')
      .populate('observers')
      .exec();
  }

  async updateListener(
    id: string,
    updateListener: Listener,
  ): Promise<Listener> {
    return this.listenerModel.findByIdAndUpdate(id, updateListener).exec();
  }

  async deleteListener(id: string): Promise<Listener> {
    return this.listenerModel.findByIdAndDelete(id).exec();
  }

  async scrape(id: string) {
    this.logger.debug('Scrapping job started...');
    const listener = await this.getListener(id);
    return await this.taskService.handle(listener);
  }
}
