import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class HistoryDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  component_id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;
}
