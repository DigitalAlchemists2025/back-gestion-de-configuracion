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

  async create(dto: CreateComponentDto) {
    const { descriptions, ...rest } = dto;

    const component = new this.componentModel({
      ...rest,
      descriptions: [],
    });
    await component.save();

    if (descriptions && descriptions.length > 0) {
      for (const descDto of descriptions) {
        const newDescription = await this.descriptionModel.create(descDto);
        component.descriptions.push(newDescription._id);
      }
      await component.save();
    }

    return this.componentModel
      .findById(component._id)
      .populate('descriptions')
      .populate('components');
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
    const component = await this.componentModel.findById(id);
    if (!component) throw new NotFoundException('Componente no encontrado');

    if (dto.name) component.name = dto.name;
    if (dto.type) component.type = dto.type;
    if (dto.status) component.status = dto.status as 'activo' | 'de baja';
    if (dto.components) {
      component.components = dto.components.map(id => new Types.ObjectId(id));
    }

    if (dto.descriptions && Array.isArray(dto.descriptions)) {
      const newDescIds: Types.ObjectId[] = [];
      for (const descDto of dto.descriptions) {
        const created = await this.descriptionModel.create(descDto);
        newDescIds.push(created._id);
      }
      component.descriptions = newDescIds;
    }

    if(dto.isSubComponent) component.isSubComponent = dto.isSubComponent;

    await component.save();

    return this.componentModel
      .findById(component._id)
      .populate('descriptions')
      .populate('components');
  }

  async delete(id: string) {
    const deleted = await this.componentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Componente no encontrado');
    return deleted;
  }

  async addDescription(componentId: string, dto: CreateDescriptionDto) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');

    const newDescription = await this.descriptionModel.create(dto);
    component.descriptions.push(newDescription._id);
    await component.save();

    return newDescription;
  }

  async addSubComponent(componentId: string, dto: CreateComponentDto) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');

    const subComponent = await this.create(dto);
    subComponent.isSubComponent = true;
    await subComponent.save();
    component.components.push(subComponent._id);
    await component.save();

    return subComponent;
  }

  async associateChildComponent(parentId: string, childId: string) {
    const parent = await this.componentModel.findById(parentId);
    if (!parent) throw new NotFoundException('Componente no encontrado');

    const child = await this.componentModel.findById(childId);
    if (!child) throw new NotFoundException('Subcomponente no encontrado');

    if (child.isSubComponent) {
      throw new Error('Este componente ya está asociado como subcomponente de otro.');
    }

    const alreadyAssociated = parent.components.some(
      (compId) => compId.toString() === childId
    );

    if (!alreadyAssociated) {
      parent.components.push(child._id);
      await parent.save();

      child.isSubComponent = true;
      await child.save();
    }

    return this.componentModel
      .findById(parent._id)
      .populate('components')
      .populate('descriptions');
  }
}

