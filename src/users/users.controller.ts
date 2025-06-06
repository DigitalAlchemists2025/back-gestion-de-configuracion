import { UserService } from './users.service';
import { UserDTO } from './dto/user.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  create(@Body() userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener Todos' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener uno por id' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar' })
  update(@Param('id') id: string, @Body() userDTO: UserDTO) {
    return this.userService.update(id, userDTO);
  }

  @Roles('administrador')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
