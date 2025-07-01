import { UserService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { Controller, Post, Body, Get, Param, Put, Delete,UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear usuario', description: 'Crea un nuevo usuario en el sistema.' })
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(@Body() userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Obtiene una lista de todos los usuarios registrados en el sistema.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Obtiene un usuario específico por su ID.' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Usuario no encontrado o error interno del servidor.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario por ID',
    description: 'Actualiza los datos de un usuario por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario.' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Usuario no encontrado o error interno del servidor.' })
  update(@Param('id') id: string, @Body() userDTO: UpdateUserDTO) {
    return this.userService.update(id, userDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario por ID',
    description: 'Elimina un usuario identificado por ID del sistema.',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario.' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
