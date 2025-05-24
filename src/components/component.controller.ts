import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDescriptionDto } from 'src/descriptions/dto/create-description.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('components')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  create(@Body() dto: CreateComponentDto) {
    return this.componentService.create(dto);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto) {
    return this.componentService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.componentService.delete(id);
  }

  @Post(':id/descriptions')
  async addDescription(
    @Param('id') componentId: string,
    @Body() dto: CreateDescriptionDto,
  ) {
    return this.componentService.addDescription(componentId, dto);
  }

  @Post(':id/components')
  async addSubComponent(
    @Param('id') componentId: string,
    @Body() dto: CreateComponentDto,
  ) {
    return this.componentService.addSubComponent(componentId, dto);
  }

  @Post(':id/associate/:childId')
  async associateChild(
    @Param('id') parentId: string,
    @Param('childId') childId: string
  ) {
  return this.componentService.associateChildComponent(parentId, childId);
  }

  @Post(':id/disassociate/:childId')
  async disassociateChild(
    @Param('id') parentId: string,
    @Param('childId') childId: string
  ) {
    return this.componentService.disassociateChildComponent(parentId, childId);
  }
}