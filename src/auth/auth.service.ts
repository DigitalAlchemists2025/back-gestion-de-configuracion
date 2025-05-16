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
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      username: user.email,
      sub: user._id,
    };
  
    const accessToken = this.jwtService.sign(payload);
  
    return {
      access_token: accessToken,
      id: user._id,
    };
  }

  async signUp(userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  async validateEmail(email: string) {
    return this.userService.findByEmail(email);
  }
}
