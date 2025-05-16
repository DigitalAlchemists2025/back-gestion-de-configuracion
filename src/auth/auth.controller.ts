import { Body, Controller, Post, Get, Req, UseGuards, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  @Get('email/:correo')
  @ApiOperation({ summary: 'Validar inicio desde google' })
  async loginOrDefault(@Param('correo') correo: string) {
    let user: any;
    try {
      user = await this.authService.validateEmail(correo);
    } catch {
      console.log("EMAIL NO REGISTRADO")
    } finally {
      if (!user) {
        user = {
          _id: '6807207a89cd891a98034975',
          email: 'user@ucn.cl',
          role: 'usuario',
        };
      }
    }

    const { access_token, id } = await this.authService.signIn(user);

    return {
      access_token,
      id,
      role: user.role,
    };
  }
}
