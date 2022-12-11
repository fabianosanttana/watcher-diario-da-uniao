import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { CrawlerService } from './crawler.service';

describe('Cron service test', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
    module.useLogger(new Logger());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get results from search', async () => {
    const result = await service.handle('https://www.in.gov.br/consulta/-/buscar/dou?q=+pronac&s=do1&exactDate=all&sortType=0');

    expect(result).toBeDefined();
    expect(result.results.length).toBeGreaterThan(0);
  }, 40000);

  it('should get no results from search', async () => {
    const result = await service.handle('https://www.in.gov.br/consulta/-/buscar/dou?q=+pronac22201&s=do1&exactDate=all&sortType=0');

    expect(result).toBeDefined();
    expect(result.results.length).toBe(0);
  }, 40000);
});
