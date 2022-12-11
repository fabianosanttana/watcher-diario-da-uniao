import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateListenerDto {
  @ApiProperty({ description: 'Query used for search', example: 'Pronac' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  query: string;

  @ApiProperty({
    description: 'Type of act',
    example: 'Instrução Normativa e Instrução',
    required: false,
  })
  @IsOptional()
  @IsString()
  actType?: string;

  @ApiProperty({
    description: 'Main organization',
    example: 'Ministério do Turismo',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainOrganization?: string;

  @ApiProperty({
    description: 'Sub organization',
    example: 'Secretaria Especial da Cultura',
    required: false,
  })
  @IsOptional()
  @IsString()
  subOrganization?: string;

  @ApiProperty({
    description: 'Listener title',
    example: 'Pronac verificações',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;


  @ApiProperty({
    description: 'Listener url',
    example: 'http://google.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;
}
