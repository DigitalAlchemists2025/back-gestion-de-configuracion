import { Document, Types } from 'mongoose';

export interface Component extends Document {
  _id: Types.ObjectId;
  name: string;
  type: string;
  status: 'activo' | 'de baja';
  descriptions: Types.ObjectId[];
  components: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}