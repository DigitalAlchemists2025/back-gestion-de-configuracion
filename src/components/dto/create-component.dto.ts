import { IsString, IsOptional, IsArray, IsMongoId, IsIn } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsIn(['activo', 'de baja'])
  @IsOptional()
  status?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  description?: string[];

  @IsMongoId()
  @IsOptional()
  componentFrom?: string;
}
