import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class HistoryDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  component_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  component_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  component_type: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  subcomponent_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subcomponent_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subcomponent_type?: string;
}
