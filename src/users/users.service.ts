import { HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from '../common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER.name) private readonly model: Model<IUser>, // Inyecta el modelo de Mongoose
  ) {}

  // Verifica si una contraseña coincide con la almacenada en la base de datos
  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  // Busca un usuario por su nombre de usuario
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  // Hashea una contraseña
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Crea un nuevo usuario
  async create(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    return await newUser.save();
  }

  // Obtiene todos los usuarios
  async findAll(): Promise<IUser[]> {
    return await this.model.find().exec();
  }

  // Obtiene un usuario por su ID
  async findOne(id: string): Promise<IUser | null> {
    return await this.model.findById(id).exec();
  }

  // Actualiza un usuario por su ID
  async update(id: string, userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const user = { ...userDTO, password: hash };
    return await this.model.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  // Elimina un usuario por su ID
  async delete(id: string): Promise<{ status: number; msg: string }> {
    await this.model.findByIdAndDelete(id).exec();
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}