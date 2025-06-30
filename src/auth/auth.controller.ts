import { Body, Controller, Post, Get, Req, Param, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Validar credenciales inicio de sesión'})
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('signup')
  @ApiOperation({ summary: 'Crear credenciales inicio de sesión'})
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  @Get('email/:correo')
  @ApiOperation({ summary: 'Validar inicio desde google' })
  async loginOrDefault(@Param('correo') correo: string) {
    let user: any;
    try {
      user = await this.authService.validateEmail(correo);
    } catch (error){
      console.error("Email no registrado", error)
    } finally {
      if (!user) {
        user = await this.authService.validateEmail('user@ucn.cl')
      }
    }

    const { access_token, id } = await this.authService.signIn(user);

    return { access_token, id, role: user.role };
  }
}
