import { IsString } from 'class-validator';

export class CreateDescriptionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}