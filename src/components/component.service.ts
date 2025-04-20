import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from 'src/common/interfaces/component.interface';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel('Component') private readonly componentModel: Model<Component>,
  ) {}

  async create(createComponentDto: CreateComponentDto) {
    const created = new this.componentModel(createComponentDto);
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

  async update(id: string, updateComponentDto: UpdateComponentDto) {
    const updated = await this.componentModel.findByIdAndUpdate(id, updateComponentDto, {
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