import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDescriptionDto } from 'src/descriptions/dto/create-description.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('components')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get('search')
  searchComponents(@Query('q') query: string) {
    return this.componentService.searchComponents(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.update(id, dto, userId);
  }

  @Roles('administrador')
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.delete(id, userId);
  }

  @Roles('administrador')
  @Post(':id/descriptions')
  async addDescription(@Param('id') componentId: string, @Body() dto: CreateDescriptionDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.addDescription(componentId, dto, userId);
  }

  @Roles('administrador')
  @Delete(':id/descriptions/:id_description')
  async removeDescription(@Param('id') componentId: string, @Param('id_description') descriptionId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.removeDescription(componentId, descriptionId, userId);
  }

  @Roles('administrador')
  @Put(':id/descriptions/:id_description')
  async updateDescription(@Param('id') componentId: string, @Param('id_description') descriptionId: string, @Body() dto: CreateDescriptionDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.updateDescription(componentId, descriptionId, dto, userId);
  }

  @Roles('administrador')
  @Post(':id/components')
  async addSubComponent(@Param('id') componentId: string, @Body() dto: CreateComponentDto, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.addSubComponent(componentId, dto, userId);
  }

  @Roles('administrador')
  @Post(':id/associate/:childId')
  async associateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.associateChildComponent(parentId, childId, userId);
  }

  @Roles('administrador')
  @Post(':id/disassociate/:childId')
  async disassociateChild(@Param('id') parentId: string, @Param('childId') childId: string, @Request() req) {
    const userId = req.user.userId;
    return this.componentService.disassociateChildComponent(parentId, childId, userId);
  }
}