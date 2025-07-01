import { HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly model: Model<IUser>, 
  ) {}

  /*
  Compara la contraseña proporcionada con la contraseña de la base de datos.
  Utiliza bcrypt para verificar si la contraseña ingresada coincide con el hash almacenado.
  */
  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  /*  
  Busca un usuario por su correo electrónico.
  Retorna el usuario o null si no existe.
  */
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  /*  
  Genera un hash de la contraseña utilizando bcrypt.
  Retorna el hash de la contraseña.
  */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /*  
  Crea un nuevo usuario en la base de datos.
  La contraseña se hashea antes de guardarla.
  Retorna el usuario creado.
  */
  async create(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    return await newUser.save();
  }

  /*  
  Obtiene todos los usuarios de la base de datos.
  */
  async findAll(): Promise<IUser[]> {
    return await this.model.find().exec();
  }

  /*  
  Busca un usuario por su ID.
  */
  async findOne(id: string): Promise<IUser | null> {
    return await this.model.findById(id).exec();
  }

  /*  
  Actualiza un usuario por su ID.
  Si se proporciona una nueva contraseña, se hashea antes de actualizar.
  Retorna el usuario actualizado.
  */
  async update(id: string, userDTO: UpdateUserDTO): Promise<IUser> {
    let user = userDTO;
    if (userDTO.password) {
      const hash = await this.hashPassword(userDTO.password);
      user = { ...userDTO, password: hash }
    }
    return await this.model.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  /*  
  Elimina un usuario por su ID.
  */
  async delete(id: string): Promise<{ status: number; msg: string }> {
    await this.model.findByIdAndDelete(id).exec();
    return { status: HttpStatus.OK, msg: 'Deleted' };
  }
}