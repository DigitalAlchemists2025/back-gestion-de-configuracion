import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComponentDto } from './dto/component.dto';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel('Component') private readonly componentModel: Model<any>,
  ) {}

  async create(data: ComponentDto) {
    const created = new this.componentModel(data);
    return created.save();
  }

  async findAll() {
    return this.componentModel.find().exec();
  }

  async findOne(id: string) {
    const component = await this.componentModel.findById(id).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');
    return component;
  }

  async update(id: string, data: ComponentDto) {
    const updated = await this.componentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Componente no encontrado');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.componentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Componente no encontrado');
    return deleted;
  }
}