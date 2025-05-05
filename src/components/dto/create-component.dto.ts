import { IsString, IsOptional, IsMongoId, IsArray, IsIn } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsIn(['activo', 'de baja'])
  @IsOptional()
  status?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  descriptions?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  components?: string[];
}