import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentDto } from './dto/component.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('components')
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  create(@Body() dto: ComponentDto) {
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
  update(@Param('id') id: string, @Body() dto: ComponentDto) {
    return this.componentService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.componentService.delete(id);
  }
}