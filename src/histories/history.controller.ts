import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Crear un nuevo historial' })
  create(@Body() dto: HistoryDto) {
    return this.historyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los historiales' })
  findAll() {
    return this.historyService.findAll();
  }

  @Get('/components/:id')
  @ApiOperation({ summary: 'Obtener historiales por ID del componente' })
  findByComponentId(@Param('id') id: string) {
    return this.historyService.findByComponentId(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un historial por ID' })
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un historial por ID' })
  update(@Param('id') id: string, @Body() dto: HistoryDto) {
    return this.historyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un historial por ID' })
  delete(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
