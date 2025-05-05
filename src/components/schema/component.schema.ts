import * as mongoose from 'mongoose';

export const ComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['activo', 'de baja'], default: 'activo' },
    descriptions: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
      }
    ],
    components: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],
  },
  { timestamps: true }
);

ComponentSchema.index({ name: 1 });