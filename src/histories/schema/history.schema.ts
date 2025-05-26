import * as mongoose from 'mongoose';

export const HistorySchema = new mongoose.Schema(
  {
    component_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true, },
    component_name: { type: String, required: true, },
    component_type: { type: String, required: true, }, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    date: { type: Date, default: Date.now, },
    action: { type: String, required: true, },
    subcomponent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', default: null, },
    subcomponent_name: { type: String, default: null, },
    subcomponent_type: { type: String, default: null, },
  },
  { timestamps: true },
);
