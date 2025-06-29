import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('components')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Roles('administrador')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo componente' })
  create(@Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.create(dto, userId);
  }

  @ApiOperation({ summary: 'Obtener todos los componentes' })
  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Filtrar componentes' })
  searchComponents(@Query('q') query: string) {
    return this.componentService.searchComponents(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un componente por ID' })
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un componente por ID' })
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.update(id, dto, userId);
  }

  @Roles('administrador')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un componente por ID' })
  delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.delete(id, userId);
  }

  @Roles('administrador')
  @Post(':id/components')
  @ApiOperation({ summary: 'Agregar un subcomponente nuevo a un componente' })
  async addSubComponent(@Param('id') componentId: string, @Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.addSubComponent(componentId, dto, userId);
  }

  @Roles('administrador')
  @Post(':id/associate/:childId')
  @ApiOperation({ summary: 'Asociar un subcomponente existente a un componente' })
  async associateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.associateChildComponent(parentId, childId, userId);
  }

  @Roles('administrador')
  @Post(':id/disassociate/:childId')
  @ApiOperation({ summary: 'Desasociar un subcomponente de un componente' })
  async disassociateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.disassociateChildComponent(parentId, childId, userId);
  }
}