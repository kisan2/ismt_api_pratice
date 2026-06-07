//auth.controller.ts
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Body, Controller, Get, Post, Req, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { Public } from './public.decorator';
import { RegisterDto } from './dto/register.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';

interface RequestWithUser extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { access_token, refresh_token, user } =
      await this.authService.login(body.email, body.password);

    return {
      message: 'Login successful',
      user,
      access_token,
      refresh_token
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getMe(@Req() req: RequestWithUser) {
    return this.authService.get()
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token required');
    }
    
    const refreshToken = authHeader.split(' ')[1];
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    await this.authService.logout(req.user.sub);
    return { message: 'Logged out successfully' };
  }
}