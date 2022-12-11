import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  ScrapingResultDto,
  ScrappingResultListItemDto,
} from 'src/core/dtos/sraping-result.dto';
import { load } from 'cheerio';
const puppeteer = require('puppeteer');

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  /**
   * It fetches the data from the given url, parses the result and returns the result
   * @param {string} url - The URL to be scraped.
   * @returns A promise of a ScrapingResultDto
   */
  async handle(url: string): Promise<ScrapingResultDto> {
    this.logger.debug('Executing web scrapping in Crawler service');

    var result = await this.fetchDataAndParseResult(url);

    return result;
  }

  private async fetchDataAndParseResult(
    url: string,
  ): Promise<ScrapingResultDto> {
    const response = await this.fetchData(url);

    if (!response) {
      this.logger.warn('No data found for search');
      return;
    }

    const $ = await load(response);

    const results = $('.resultados-wrapper');
    const resultItemsArray = results.toArray();

    this.logger.debug('Results found: ' + resultItemsArray.length);

    const scrapingResult: ScrappingResultListItemDto[] = resultItemsArray.map(
      (item) => {
        const $item = $(item);
        const url =
          'https://www.in.gov.br' + $item.find('div h5 a').attr('href');
        const title = $item.find('div h5 a').text();
        const smallContent = $item.find('div p.abstract-marker').text();
        const publishedAt = $item.find('div p.date-marker').text();

        return {
          url,
          title: title.replace(/\n/g, '').trim(),
          smallContent,
          publishedAt,
        };
      },
    );

    const totalResult = $('.search-total-label').text();

    this.logger.debug(
      'Results parsed successfully, total result: ' + totalResult,
    );

    const totalResults = !totalResult
      ? resultItemsArray.length
      : parseInt(totalResult.match(/\d+/g).join(''));

    return {
      searchUrl: url,
      results: scrapingResult,
      totalResults: totalResults,
    };
  }

  private async fetchData(url: string): Promise<string> {
    this.logger.debug('Crawling data...');
    try {
      // const isDev =
      //   process.env.NODE_ENV === 'development' ||
      //   process.env.NODE_ENV === 'test';

      const chromiumPath = process.env.CHROMIUM_PATH;

      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        executablePath: chromiumPath,
        // ? chromiumPath
        // : isDev
        // ? '/usr/local/bin/chromium'
        // : '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--ignore-certificate-errors',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      this.logger.debug('Puppeteer ready to collect data...');
      this.logger.debug(`Getting data from: ${url}.`);

      const page = await browser.newPage();
      page.setViewport({ width: 1366, height: 768 });
      await page.goto(url, { timeout: 10000, waitUntil: 'domcontentloaded' });
      await page
        .waitForSelector('.search-total-label', { timeout: 7000 })
        .catch((e) => this.logger.error(e));
      const html = await page.content();
      await browser.close();

      return html;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
