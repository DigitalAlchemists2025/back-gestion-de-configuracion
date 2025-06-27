import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';

@Injectable()
export class DescriptionService {
  constructor(
    @InjectModel('Description') private readonly descriptionModel: Model<any>,
  ) {}

  async create(dto: CreateDescriptionDto) {
    const newDesc = new this.descriptionModel(dto);
    return newDesc.save();
  }

  async findAll() {
    return this.descriptionModel.find();
  }

  async findOne(id: string) {
    const item = await this.descriptionModel.findById(id);
    if (!item) throw new NotFoundException('Descripción no encontrada');
    return item;
  }

  async update(id: string, dto: UpdateDescriptionDto) {
    const updated = await this.descriptionModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Descripción no encontrada');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.descriptionModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Descripción no encontrada');
    return deleted;
  }
}
