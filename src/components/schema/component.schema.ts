import * as mongoose from 'mongoose';

export const ComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true },
);

ComponentSchema.index({ name: 1 });