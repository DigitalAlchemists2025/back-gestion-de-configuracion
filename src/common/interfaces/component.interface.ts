import { Document, Types } from 'mongoose';
import { Description } from './description.interface';

export interface Component extends Document {
  _id: Types.ObjectId;
  name: string;
  type: string;
  status: 'activo' | 'de baja';
  descriptions: Types.ObjectId[];
  components: Types.ObjectId[];
  parent: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedComponent extends Omit<Component, 'descriptions' | 'components'> {
  descriptions: { name: string; description: string }[];
  components: { name: string }[];
}