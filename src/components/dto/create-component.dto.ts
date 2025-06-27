import { IsString, IsOptional, IsMongoId, IsArray, IsIn, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class InlineDescriptionDto {
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsIn(['activo', 'de baja'])
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InlineDescriptionDto)
  @IsOptional()
  descriptions?: InlineDescriptionDto[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  components?: string[];

  @IsMongoId()
  @IsOptional()
  parent?: string;
}