import { Document } from 'mongoose';

export interface Component extends Document {
  name: string;
  type: string;
  status: 'activo' | 'de baja';
  description?: string[];
  componentFrom?: string; // o `Component` si quieres anidamiento más estricto
  createdAt: Date;
  updatedAt: Date;
}