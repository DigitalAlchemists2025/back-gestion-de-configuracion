import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryDto } from './dto/history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('histories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() dto: HistoryDto) {
    return this.historyService.create(dto);
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get('/components/:id')
  findByComponentId(@Param('id') id: string) {
    return this.historyService.findByComponentId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: HistoryDto) {
    return this.historyService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
