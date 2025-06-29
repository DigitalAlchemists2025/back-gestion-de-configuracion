import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["usuario", "administrador"], default: "usuario" }
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });