import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  /*
  Valida las credenciales del usuario.
  Busca al usuario por su correo electrónico y verifica la contraseña.
  Si las credenciales son válidas, retorna el usuario; de lo contrario, retorna null.
  */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }

  /*
  Valida inicio de sesión por credenciales.
  Genera un token JWT con el payload del usuario.
  Retorna el token, el ID del usuario y su rol.
  */
  async signIn(user: any) {
    const payload = {
      username: user.email,
      sub: user._id,
      role: user.role || 'usuario',
    };
  
    const accessToken = this.jwtService.sign(payload);
  
    return {
      access_token: accessToken,
      id: user._id,
      role: user.role || 'usuario',
    };
  }

  /*  
  Crea un nuevo usuario en la base de datos con los datos proporcionados en userDTO.
  Retorna el usuario creado.
  */
  async signUp(userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  /*  
  Valida el correo electrónico proporcionado.
  Busca al usuario por su correo electrónico y retorna el usuario.
  Si no existe, retorna null. 
  */
  async validateEmail(email: string) {
    return this.userService.findByEmail(email);
  }
}
