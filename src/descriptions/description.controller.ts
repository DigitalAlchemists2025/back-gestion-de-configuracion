import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('descriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DescriptionController {
  constructor(private readonly service: DescriptionService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateDescriptionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDescriptionDto) {
    return this.service.update(id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
