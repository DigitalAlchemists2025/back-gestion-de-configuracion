import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component, PopulatedComponent } from 'src/common/interfaces/component.interface';
import { CreateDescriptionDto } from 'src/descriptions/dto/create-description.dto';
import { Description } from 'src/common/interfaces/description.interface';
import { HistoryService } from 'src/histories/history.service';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel('Component') private readonly componentModel: Model<Component>,
    @InjectModel('Description') private readonly descriptionModel: Model<Description>,
    private readonly historyService: HistoryService,
  ) {}

  async create(dto: CreateComponentDto, userId: string) {
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


    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Crear componente',
    });

    return this.componentModel
      .findById(component._id)
      .populate('descriptions')
      .populate('components');
  }

  async findAll() {
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

  async searchComponents(query: string) {
    const terms = query.toLowerCase().split(' ').filter(Boolean);

    const components = await this.componentModel
      .find()
      .populate('descriptions')
      .populate('components')
      .exec();

    const populated = components as unknown as PopulatedComponent[];

    return populated.filter(component => {
      const valuesToSearch = [
        component.name,
        component.type,
        ...component.descriptions.map(d => `${d.name} ${d.description}`),
        ...component.components.map(c => c.name),
      ]
        .join(' ')
        .toLowerCase();

      return terms.every(term => valuesToSearch.includes(term));
    });
  }

  async update(id: string, dto: UpdateComponentDto, userId: string) {
    const component = await this.componentModel.findById(id);
    if (!component) throw new NotFoundException('Componente no encontrado');

    const original = { ...component.toObject() };
    const changes: Record<string, any> = {};

    if (dto.name && dto.name !== original.name) {
      component.name = dto.name;
      changes.name = { before: original.name, after: dto.name };
    }
    if (dto.type && dto.type !== original.type) {
      component.type = dto.type;
      changes.type = { before: original.type, after: dto.type };
    }
    if (dto.status && dto.status !== original.status) {
      component.status = dto.status as 'activo' | 'de baja';
      changes.status = { before: original.status, after: dto.status };
    }

    if (dto.descriptions && Array.isArray(dto.descriptions)) {
      const newDescIds: Types.ObjectId[] = [];
      for (const descDto of dto.descriptions) {
        const created = await this.descriptionModel.create(descDto);
        newDescIds.push(created._id);
      }
      component.descriptions = newDescIds;
    }

    await component.save();

    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Editar componente',
      details: changes,
    });

    return this.componentModel
      .findById(component._id)
      .populate('descriptions')
      .populate('components');
  }

  async delete(id: string, userId: string) {
    const component = await this.componentModel.findById(id);
    if (!component) throw new NotFoundException('Componente no encontrado');

    if (component.components.length > 0) {
      throw new BadRequestException('No se puede eliminar un componente que tiene subcomponentes.');
    }
    if (component.parent){
      await this.disassociateChildComponent(component.parent.toString(), component._id.toString(), userId);
    }

    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Eliminar componente',
    });
    
    await this.componentModel.deleteOne({ _id: id });
    return {
    message: 'Componente eliminado exitosamente',
    componentId: id,
    };
  }

  async addDescription(componentId: string, dto: CreateDescriptionDto, userId: string) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');

    const newDescription = await this.descriptionModel.create(dto);
    component.descriptions.push(newDescription._id);
    await component.save();

    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Agregar descripción',
      details: {
        descripcion_agregada: dto,
      },
    });
  }

  async removeDescription(componentId: string, descriptionId: string, userId: string) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');  

    const index = component.descriptions.findIndex(
      (id) => id.toString() === descriptionId,
    );
    if (index === -1) throw new NotFoundException('Descripción no asociada al componente');
    
    component.descriptions.splice(index, 1);
    await component.save();

    const deleted = await this.descriptionModel.findByIdAndDelete(descriptionId);

    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Eliminar descripción',
      details: {
        descripcion_eliminada: deleted,
      },
    });
  }

  async updateDescription(componentId: string, descriptionId: string, dto: CreateDescriptionDto, userId: string) {
    const component = await this.componentModel.findById(componentId);
    if (!component) throw new NotFoundException('Componente no encontrado');

    const description = await this.descriptionModel.findById(descriptionId);
    if (!description) throw new NotFoundException('Descripción no encontrada');

    const original = { name: description.name, description: description.description };

    description.name = dto.name;
    description.description = dto.description;
    await description.save();

    await this.historyService.create({
      user_id: userId,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Editar descripción',
      details: {
        antes: original,
        despues: dto,
      },
    });

    return description;
  }

  async addSubComponent(componentId: string, dto: CreateComponentDto, userid: string) {
    const component = await this.componentModel.findById(componentId).exec();
    if (!component) throw new NotFoundException('Componente no encontrado');

    const subComponent = await this.create(dto, userid);
    subComponent.parent = component._id;
    await subComponent.save();
    component.components.push(subComponent._id);
    await component.save();

    await this.historyService.create({
      user_id: userid,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Asociar subcomponente',
      subcomponent_id: subComponent._id.toString(),
      subcomponent_name: subComponent.name,
      subcomponent_type: subComponent.type,
    });

    return subComponent;
  }

  async associateChildComponent(componentId: string, subComponentId: string, userid: string) {
    const component = await this.componentModel.findById(componentId);
    if (!component) throw new NotFoundException('Componente no encontrado');

    const subComponent = await this.componentModel.findById(subComponentId);
    if (!subComponent) throw new NotFoundException('Subcomponente no encontrado');

    if (subComponent.parent) {
      throw new Error('Este componente ya está asociado como subcomponente de otro.');
    }

    const alreadyAssociated = component .components.some(
      (compId) => compId.toString() === subComponentId
    );

    if (!alreadyAssociated) {
      subComponent.parent = component._id;
      await subComponent.save();

      component.components.push(subComponent._id);
      await component.save();
    }

    await this.historyService.create({
      user_id: userid,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Asociar subcomponente',
      subcomponent_id: subComponent._id.toString(),
      subcomponent_name: subComponent.name,
      subcomponent_type: subComponent.type,
    });

    return this.componentModel
      .findById(component._id)
      .populate('components')
      .populate('descriptions');
  }

  async disassociateChildComponent(componentId: string, subComponentId: string, userid: string) {
    const component = await this.componentModel.findById(componentId);
    if (!component) throw new NotFoundException('Componente no encontrado');

    const subComponent = await this.componentModel.findById(subComponentId);
    if (!subComponent) throw new NotFoundException('Subcomponente no encontrado');

    const index = component.components.indexOf(subComponent._id);
    if (index > -1) {
      component.components.splice(index, 1);
      await component.save();
    }
    subComponent.parent = null;

    await this.historyService.create({
      user_id: userid,
      component_id: component._id.toString(),
      component_name: component.name,
      component_type: component.type,
      action: 'Desasociar subcomponente',
      subcomponent_id: subComponent._id.toString(),
      subcomponent_name: subComponent.name,
      subcomponent_type: subComponent.type,
    });

    await subComponent.save();
  }
}

