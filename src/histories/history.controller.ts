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
@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: HistoryDto) {
    return this.historyService.create(dto);
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }

  @Roles('administrador')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: HistoryDto) {
    return this.historyService.update(id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
