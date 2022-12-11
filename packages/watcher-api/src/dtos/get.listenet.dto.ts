import { ApiProperty } from '@nestjs/swagger';
import { Archive } from 'src/core/schemas/archive.schema';
import { Listener } from 'src/core/schemas/listener.schema';
import { GetListenerListDto } from './get.list.listener.dto';

class GetListenerArchiveDto {
  @ApiProperty({
    description: 'Archive title',
    example: 'PORTARIA Nº 609, DE 7 DE NOVEMBRO DE 2022',
  })
  title: string;

  @ApiProperty({
    description: 'Archive small content',
    example: `s) por meio do mecanismo de Incentivo a Projetos Culturais do Programa Nacional de Apoio à Cultura (PRONAC ... s) por meio do mecanismo de Incentivo a 
      Projetos Culturais do Programa Nacional de Apoio à Cultura (PRONAC ... LUCAS JORDÃO CUNHA ANEXO I`,
  })
  smallContent: string;

  @ApiProperty({
    description: 'Archive url',
    example:
      'https://www.in.gov.br/web/dou/-/portaria-n-609-de-7-de-novembro-de-2022-442054696',
  })
  url: string;

  @ApiProperty({
    description: 'Archive published date',
    example: '12/11/2022',
  })
  publishedAt: string;

  static fromArchive(archive: Archive): GetListenerArchiveDto {
    return {
      title: archive.title,
      smallContent: archive.smallContent,
      url: archive.url,
      publishedAt: archive.publishedAt,
    };
  }
}

export class GetListenerDto extends GetListenerListDto {
  @ApiProperty({
    type: [GetListenerArchiveDto],
  })
  archives: GetListenerArchiveDto[];

  static fromListener(listener: Listener): GetListenerDto {
    const lastRunArchives = listener.listenerArchives.sort(
      (a, b) => b.createdAt - a.createdAt,
    )[0];

    return {
      ...super.fromListener(listener),
      archives: lastRunArchives?.archives.map(GetListenerArchiveDto.fromArchive),
    };
  }
}
