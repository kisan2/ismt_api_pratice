import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email },
    };
  }

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    return {
      message: 'User created',
      user: { id: user.id, email: user.email },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      // Now using findById — cleaner than going through email
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const newPayload = { sub: user.id, email: user.email };

      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '1h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.usersService.updateRefreshToken(user.id, hashedNewRefreshToken);

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }
}