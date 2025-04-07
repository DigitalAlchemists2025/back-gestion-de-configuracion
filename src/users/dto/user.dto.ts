import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class UserDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    enum: ['usuario', 'administrador'],
    default: 'usuario',
  })
  @IsOptional()
  @IsString()
  @IsIn(['usuario', 'administrador']) 
  readonly role?: string = 'usuario'; 
}
