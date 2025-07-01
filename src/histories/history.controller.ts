import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryDto } from './dto/history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('histories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo historial',
    description: 'Registra un historial para un componente.',
  })
  @ApiBody({ type: HistoryDto })
  @ApiResponse({ status: 201, description: 'Historial creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al crear el historial.' })
  create(@Body() dto: HistoryDto) {
    return this.historyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los historiales',
    description: 'Devuelve todos los historiales existentes.',
  })
  @ApiResponse({ status: 200, description: 'Lista de historiales.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los historiales.' })
  findAll() {
    return this.historyService.findAll();
  }

  @Get('/components/:id')
  @ApiOperation({ summary: 'Obtener historiales por ID del componente',
    description: 'Lista los historiales asociados a un componente.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente.' })
  @ApiResponse({ status: 200, description: 'Lista de historiales del componente.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los historiales.' })
  findByComponentId(@Param('id') id: string) {
    return this.historyService.findByComponentId(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un historial por ID',
    description: 'Devuelve un historial específico por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID del historial.' })
  @ApiResponse({ status: 200, description: 'Historial encontrado.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al obtener el historial.' })
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un historial por ID',
    description: 'Permite modificar un historial existente.',
  })
  @ApiParam({ name: 'id', description: 'ID del historial a actualizar.' })
  @ApiBody({ type: HistoryDto })
  @ApiResponse({ status: 200, description: 'Historial actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el historial.' })
  update(@Param('id') id: string, @Body() dto: HistoryDto) {
    return this.historyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un historial por ID',
    description: 'Elimina un historial identificado por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID del historial a eliminar.' })
  @ApiResponse({ status: 200, description: 'Historial eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al eliminar el historial.' })
  delete(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
