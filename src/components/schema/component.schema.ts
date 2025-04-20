import * as mongoose from 'mongoose';

export const ComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['activo', 'de baja'], default: 'activo' },
    componentFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: false}
  },
  { timestamps: true },
);

ComponentSchema.index({ name: 1 });