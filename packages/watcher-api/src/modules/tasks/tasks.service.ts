import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { ScrapingResultDto } from 'src/core/dtos/sraping-result.dto';
import { Archive } from 'src/core/schemas/archive.schema';
import { ListenerArchive } from 'src/core/schemas/listener-archive.schema';
import { Listener, ListenerDocument } from 'src/core/schemas/listener.schema';
import { CrawlerService } from 'src/services/crawler.service';
import { NotificationService } from 'src/services/notification.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Listener.name)
    private readonly listenerModel: Model<ListenerDocument>,
    private readonly crawlerService: CrawlerService,
    private readonly notificationService: NotificationService,
  ) {}

  async handle(listener: Listener) {
    this.logger.debug(`Handling listener: ${listener.params.query}`);

    var scrapeResult = await this.crawlerService.handle(listener.url);
    await this.handleScrapeResult(listener, scrapeResult);

    return scrapeResult;
  }

  private async handleScrapeResult(
    listener: Listener,
    scrapeResult: ScrapingResultDto,
  ) {
    this.logger.debug(`Handling scrape result for listener ${listener._id}`);
    const { totalResults, results } = scrapeResult;

    Listener.updateLastScrape(listener, totalResults);

    const listenerLastArchive = Listener.lastListenerArchive(listener);

    const hasNoArchivesOrLastArchiveCountIsEqual =
      !listenerLastArchive ||
      (totalResults != 0 && listenerLastArchive.totalResults !== totalResults);

    if (hasNoArchivesOrLastArchiveCountIsEqual) {
      this.logger.debug(`No last archive found for listener ${listener._id}`);
      const archives = results.map<Archive>(
        ({ title, publishedAt, smallContent, url }) =>
          Archive.create(title, url, smallContent, publishedAt),
      );

      const listenerArchive = ListenerArchive.create(archives, totalResults);

      Listener.addArchive(listener, listenerArchive);

      for (const observer of listener.observers) {
        await this.notificationService.createNotification(
          observer,
          listener,
          listenerArchive,
        );
      }
    }

    await this.listenerModel.findByIdAndUpdate(listener._id, listener);
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async handleCron() {
    const listeners = await this.listenerModel.find().exec();

    for (const listener of listeners) {
      this.logger.debug(`Handling listener: ${listener.params.query} in cron`);
      await this.handle(listener);
    }
  }
}
