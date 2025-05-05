import * as mongoose from 'mongoose';

export const DescriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);