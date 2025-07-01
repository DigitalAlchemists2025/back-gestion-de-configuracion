import { Body, Controller, Post, Get, Req, Param, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserDTO } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Validar credenciales de inicio de sesión',
    description: 'Verifica las credenciales del usuario y retorna un token JWT si son válidas.', 
  })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 201, description: 'Credenciales válidas. Retorna token de acceso, id y rol.' })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta.' })
  @ApiResponse({ status: 500, description: 'Correo no registrado o error interno del servidor.' })
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Crear credenciales de inicio de sesión',
    description: 'Crea un nuevo usuario con las credenciales proporcionadas.',
  })
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.'})
  @ApiResponse({ status: 500, description: 'Datos de usuario inválidos o usuario ya existente.' })
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  @Get('email/:correo')
  @ApiOperation({ summary: 'Validar inicio desde Google',
    description:'Valida el correo enviado por el frontend al iniciar sesión con Google. No disponible para pruebas desde Swagger UI.',
  })
  @ApiParam({ name: 'correo', description: 'Correo institucional de Google' })
  @ApiResponse({ status: 200, description: 'Correo válido, retorna token.' })
  @ApiResponse({ status: 403, description: 'No se permite probar este endpoint desde Swagger UI.' })
  @ApiResponse({ status: 404, description: 'Email no registrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async loginOrDefault(@Param('correo') correo: string, @Req() req: Request) {
    let user: any;

    if (req.headers.referer && req.headers.referer.includes('/api/docs')) {
      throw new ForbiddenException('No se permite probar este endpoint desde Swagger UI');
    }

    user = await this.authService.validateEmail(correo);

    if (!user) {
      throw new NotFoundException('Email no registrado');
    }

    const { access_token, id } = await this.authService.signIn(user);

    return { access_token, id, role: user.role };
  }
}
