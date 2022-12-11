export class ScrappingResultListItemDto {
  url: string;
  title: string;
  smallContent: string;
  publishedAt: string;
}

export class ScrapingResultDto {
  searchUrl: string;
  results: ScrappingResultListItemDto[];
  totalResults: number;
}