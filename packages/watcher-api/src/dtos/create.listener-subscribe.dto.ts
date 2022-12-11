import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CreateListenerSubscribeDto {
  @ApiProperty({
    description: 'Email to subscribe',
    example: 'email@hotmail.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
