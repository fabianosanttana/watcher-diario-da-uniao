import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrapingResultDto } from './core/dtos/sraping-result.dto';
import { ListenerObserver } from './core/schemas/listener-observer.schema';
import { CreateListenerSubscribeDto } from './dtos/create.listener-subscribe.dto';
import { CreateListenerDto } from './dtos/create.listener.dto';
import { GetListenerListDto } from './dtos/get.list.listener.dto';
import { GetListenerDto } from './dtos/get.listenet.dto';
import { ListenerService } from './services/listener.service';

@Controller()
@ApiTags('listener')
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly listenerService: ListenerService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: [GetListenerListDto],
  })
  async getListeners(): Promise<GetListenerListDto[]> {
    const listeners = await this.listenerService.getListeners();
    return listeners.map(GetListenerListDto.fromListener);
  }

  @ApiResponse({
    status: 200,
    type: GetListenerDto,
  })
  @Get(':id')
  async getListener(@Param('id') id: string): Promise<GetListenerDto> {
    const listener = await this.listenerService.getListener(id);
    return GetListenerDto.fromListener(listener);
  }

  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: GetListenerListDto,
  })
  @Post()
  async createListener(
    @Body() createListener: CreateListenerDto,
  ): Promise<GetListenerListDto> {
    const listener = await this.listenerService.createListener(createListener);
    return GetListenerListDto.fromListener(listener);
  }

  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: ScrapingResultDto,
  })
  @Post(':id/scrape')
  async scrape(@Param('id') id: string): Promise<ScrapingResultDto> {
    this.logger.log(`Scrapping for listener id: ${id}...`);
    return await this.listenerService.scrape(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  async deleteListener(@Param('id') id: string): Promise<void> {
    await this.listenerService.deleteListener(id);
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Post(':id/subscribe')
  async subscribe(
    @Param('id') id: string,
    @Body() subscriber: CreateListenerSubscribeDto,
  ): Promise<ListenerObserver> {
    return await this.listenerService.subscribe(id, subscriber.email);
  }
}
