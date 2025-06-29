import { IsString, IsOptional, IsMongoId, IsArray, IsIn, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class InlineDescriptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class CreateComponentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsIn(['activo', 'de baja'])
  status?: string;

  @IsArray()
  @ApiPropertyOptional({ type: [InlineDescriptionDto] })
  @ValidateNested({ each: true })
  @Type(() => InlineDescriptionDto)
  @IsOptional()
  descriptions?: InlineDescriptionDto[];

  @ApiPropertyOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  components?: string[];

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  parent?: string;
}