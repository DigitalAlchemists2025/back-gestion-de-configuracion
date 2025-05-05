import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from 'src/common/interfaces/component.interface';
import { CreateDescriptionDto } from 'src/descriptions/dto/create-description.dto';
import { Description } from 'src/common/interfaces/description.interface';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel('Component') private readonly componentModel: Model<Component>,
    @InjectModel('Description') private readonly descriptionModel: Model<Description>,
  ) {}

  create(dto: CreateComponentDto) {
    const created = new this.componentModel(dto);
    return created.save();
  }

  findAll() {
    return this.componentModel
      .find()
      .populate('descriptions') 
      .populate('components');  
  }

  async findOne(id: string) {
    const found = await this.componentModel
      .findById(id)
      .populate('descriptions')
      .populate('components');
    if (!found) throw new NotFoundException('Componente no encontrado');
    return found;
  }

  async update(id: string, dto: UpdateComponentDto) {
    const updated = await this.componentModel.findByIdAndUpdate(id, dto, {
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

  async addDescription(componentId: string, dto: CreateDescriptionDto) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) {
      throw new NotFoundException('Componente no encontrado');
    }
  
    const newDescription = await this.descriptionModel.create(dto);
  
    component.descriptions.push(newDescription._id);
    await component.save();
  
    return newDescription;
  }
  
  async addSubComponent(componentId: string, dto: CreateComponentDto) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) {
      throw new NotFoundException('Componente no encontrado');
    }
  
    const subComponent = await this.componentModel.create(dto);
  
    component.components.push(subComponent._id);
    await component.save();
  
    return subComponent;
  }
}
