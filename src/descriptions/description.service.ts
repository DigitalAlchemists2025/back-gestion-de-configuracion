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

  /*  
  Crea una nueva descripción en la base de datos.
  */
  async create(dto: CreateDescriptionDto) {
    const newDesc = new this.descriptionModel(dto);
    return newDesc.save();
  }

  /* 
  Obtiene todas las descripciones de la base de datos.
  */
  async findAll() {
    return this.descriptionModel.find();
  }

  /*  
  Busca una descripción por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  */
  async findOne(id: string) {
    const item = await this.descriptionModel.findById(id);
    if (!item) throw new NotFoundException('Descripción no encontrada');
    return item;
  }

  /*  
  Actualiza una descripción por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  Retorna la descripción actualizada.
  */
  async update(id: string, dto: UpdateDescriptionDto) {
    const updated = await this.descriptionModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Descripción no encontrada');
    return updated;
  }

  /*  
  Elimina una descripción por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  Retorna la descripción eliminada.
  */
  async delete(id: string) {
    const deleted = await this.descriptionModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Descripción no encontrada');
    return deleted;
  }
}
