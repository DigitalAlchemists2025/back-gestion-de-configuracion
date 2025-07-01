import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Crear un nuevo componente',
    description: 'Crea un componente con sus características principales, descripciones y subcomponentes (Opcional).',
  })
  @ApiBody({ type: CreateComponentDto })
  @ApiResponse({ status: 201, description: 'Componente creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 403, description: 'No autorizado para crear componentes.' })
  @ApiResponse({ status: 500, description: 'Error al crear el componente.' })
  create(@Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los componentes',
    description: 'Devuelve la lista de todos los componentes registrados en el sistema.',
  })
  @ApiResponse({ status: 200, description: 'Listado de componentes.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los componentes.' })
  findAll() {
    return this.componentService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Filtrar componentes',
    description: 'Busca componentes por nombre, tipo, descripción y subcomponentes.',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Texto de búsqueda.' })
  @ApiResponse({ status: 200, description: 'Listado filtrado de componentes.' })
  @ApiResponse({ status: 500, description: 'Error al buscar componentes.' })
  searchComponents(@Query('q') query: string) {
    return this.componentService.searchComponents(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un componente por ID',
    description: 'Devuelve el componente correspondiente al ID entregado.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente a consultar.' })
  @ApiResponse({ status: 200, description: 'Componente encontrado.' })
  @ApiResponse({ status: 401, description: 'Sin bearer token.' })
  @ApiResponse({ status: 500, description: 'Error al obtener el componente.' })
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un componente por ID',
    description: 'Actualiza los datos y descripciones de un componente existente.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente a actualizar.' })
  @ApiBody({ type: UpdateComponentDto })
  @ApiResponse({ status: 200, description: 'Componente actualizado.' })
  @ApiResponse({ status: 500, description: 'Error al actualizar componente.' })
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.update(id, dto, userId);
  }

  @Roles('administrador')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un componente por ID',
    description: 'Elimina un componente y todas sus asociaciones si existen.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente a eliminar.' })
  @ApiResponse({ status: 200, description: 'Componente eliminado correctamente.' })
  @ApiResponse({ status: 500, description: 'Error al eliminar componente.' })
  delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.delete(id, userId);
  }

  @Roles('administrador')
  @Post(':id/components')
  @ApiOperation({ summary: 'Agregar un subcomponente nuevo a un componente',
    description: 'Crea y asocia un subcomponente nuevo al componente especificado.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente.' })
  @ApiBody({ type: CreateComponentDto })
  @ApiResponse({ status: 201, description: 'Subcomponente agregado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error al agregar subcomponente.' })
  async addSubComponent(@Param('id') componentId: string, @Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.addSubComponent(componentId, dto, userId);
  }

  @Roles('administrador')
  @Post(':id/associate/:childId')
  @ApiOperation({ summary: 'Asociar un subcomponente existente a un componente',
    description: 'Asocia un subcomponente ya existente a un componente.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente.' })
  @ApiParam({ name: 'childId', description: 'ID del subcomponente a asociar.' })
  @ApiResponse({ status: 201, description: 'Subcomponente asociado correctamente.' })
  @ApiResponse({ status: 500, description: 'Error al asociar subcomponente.' })
  async associateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.associateChildComponent(parentId, childId, userId);
  }

  @Roles('administrador')
  @Post(':id/disassociate/:childId')
  @ApiOperation({ summary: 'Desasociar un subcomponente de un componente',
    description: 'Quita la asociación entre un componente y un subcomponente.',
  })
  @ApiParam({ name: 'id', description: 'ID del componente.' })
  @ApiParam({ name: 'childId', description: 'ID del subcomponente a desasociar.' })
  @ApiResponse({ status: 201, description: 'Subcomponente desasociado correctamente.' })
  @ApiResponse({ status: 500, description: 'Error al desasociar subcomponente.' })
  async disassociateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.disassociateChildComponent(parentId, childId, userId);
  }
}