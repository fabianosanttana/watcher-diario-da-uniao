import { ApiProperty } from '@nestjs/swagger';
import {
  LastScrapeResult,
  Listener,
  ListenerParams,
} from 'src/core/schemas/listener.schema';

class GetListenerScrappingResultDto {
  @ApiProperty({
    description: 'Last scraping result',
    example: 10,
  })
  totalResults: number;

  @ApiProperty({
    description: 'Last scraping date',
    example: '2020-10-28T20:00:00.000Z',
  })
  date?: Date;

  static fromLastScrappingResult(lastScraping: LastScrapeResult) {
    if (!lastScraping) return undefined;

    return {
      totalResults: lastScraping.totalResults,
      date: new Date(lastScraping.updatedAt),
    };
  }
}

class GetListenerParamsDto {
  @ApiProperty({ description: 'Query used for search', example: 'Pronac' })
  query: string;

  @ApiProperty({
    description: 'Type of act',
    example: 'Instrução Normativa e Instrução',
    required: false,
  })
  actType?: string;

  @ApiProperty({
    description: 'Main organization',
    example: 'Ministério do Turismo',
    required: false,
  })
  mainOrganization?: string;

  @ApiProperty({
    description: 'Sub organization',
    example: 'Secretaria Especial da Cultura',
    required: false,
  })
  subOrganization?: string;

  static fromListenerParams(params: ListenerParams) {
    return {
      query: params.query,
      actType: params.actType,
      mainOrganization: params.mainOrganization,
      subOrganization: params.subOrganization,
    };
  }
}

export class GetListenerListDto {
  @ApiProperty({
    description: 'Listener id',
    example: '5f9f9b0d8d8e8d1c1c1c1c1c',
  })
  id: string;

  @ApiProperty({
    description: 'Listener created date',
    example: '2020-10-28T20:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Listener update date',
    example: '2020-10-28T20:00:00.000Z',
  })
  updatedAt?: Date;

  @ApiProperty({
    type: GetListenerScrappingResultDto,
  })
  lastScrape?: GetListenerScrappingResultDto;

  @ApiProperty({
    type: GetListenerParamsDto,
  })
  params: GetListenerParamsDto;

  @ApiProperty({
    description: 'Listener url',
    example: 'http://google.com',
    required: false,
  })
  url: string;

  @ApiProperty({
    description: 'Alias to listener',
    example: 'Pronac 2020 - Verificar',
    required: false,
  })
  title: string;

  @ApiProperty({
    description: 'If the listener has updated within the last seven days',
    example: true,
  })
  hasUpdatedWithinLastTwoDays: boolean;

  @ApiProperty({
    description: 'List of subscribers',
    example: ['email@hotmail.com'],
  })
  observers: string[];

  static fromListener(listener: Listener): GetListenerListDto {
    return {
      id: listener._id.toString(),
      params: GetListenerParamsDto.fromListenerParams(listener.params),
      createdAt: new Date(listener.createdAt),
      updatedAt: new Date(listener.updatedAt),
      observers: listener.observers.map((observer) => observer.email),
      url: listener.url,
      title: listener.title,
      hasUpdatedWithinLastTwoDays:
        listener.updatedAt &&
        new Date(listener.updatedAt) >
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastScrape: GetListenerScrappingResultDto.fromLastScrappingResult(
        listener.lastScrape,
      ),
    };
  }
}
