import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryDto } from './dto/history.dto';

@ApiTags('histories')
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
