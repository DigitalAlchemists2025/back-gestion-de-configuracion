import * as mongoose from 'mongoose';

export const HistorySchema = new mongoose.Schema(
  {
    component_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
