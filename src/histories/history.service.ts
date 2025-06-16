import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel('History') private readonly historyModel: Model<any>,
  ) {}

  async create(data: HistoryDto) {
    const created = new this.historyModel(data);
    return created.save();
  }

  async findAll() {
    return this.historyModel.find().populate('component_id user_id').exec();
  }

  async findOne(id: string) {
    const history = await this.historyModel.findById(id).populate('component_id user_id').exec();
    if (!history) throw new NotFoundException('History not found');
    return history;
  }

  async findByComponentId(componentId: string) {
    const histories = await this.historyModel.find({ component_id: componentId }).populate('component_id user_id').exec();
    if (!histories || histories.length === 0) {
      throw new NotFoundException('No histories found for this component');
    }
    return histories;
  }

  async update(id: string, data: HistoryDto) {
    const updated = await this.historyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('History not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.historyModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('History not found');
    return deleted;
  }
}
