import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel('History') private readonly historyModel: Model<any>,
  ) {}

  /*
  Crea un nuevo historial en la base de datos.
  */
  async create(data: HistoryDto) {
    const created = new this.historyModel(data);
    return created.save();
  }

  /*  
  Obtiene todos los historiales de la base de datos.
  */
  async findAll() {
    return this.historyModel.find().populate('component_id user_id').exec();
  }

  /*  
  Busca un historial por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  Retorna el historial encontrado.
  */
  async findOne(id: string) {
    const history = await this.historyModel.findById(id).populate('component_id user_id').exec();
    if (!history) throw new NotFoundException('History not found');
    return history;
  }

  /*  
  Busca los historiales asociados a un componente por su ID.
  Si no se encuentran, lanza una excepción NotFoundException.
  Retorna los historiales encontrados.
  */
  async findByComponentId(componentId: string) {
    const histories = await this.historyModel.find({ component_id: componentId }).populate('component_id user_id').exec();
    if (!histories || histories.length === 0) {
      throw new NotFoundException('No histories found for this component');
    }
    return histories;
  }

  /*  
  Actualiza un historial por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  Retorna el historial actualizado.
  */
  async update(id: string, data: HistoryDto) {
    const updated = await this.historyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('History not found');
    return updated;
  }

  /*  
  Elimina un historial por su ID.
  Si no se encuentra, lanza una excepción NotFoundException.
  Retorna el historial eliminado.
  */
  async delete(id: string) {
    const deleted = await this.historyModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('History not found');
    return deleted;
  }
}
