import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private async tokens(user: { id: string; role: any; schoolId: string | null }) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role, schoolId: user.schoolId },
      { expiresIn: '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '30d' },
    );
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.phone) throw new BadRequestException('Email or phone is required');

    const user = await this.prisma.user.findFirst({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
      include: { school: true },
    });

    if (!user || !user.isActive || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokens(user);
    return {
      ...tokens,
      user: {
        id: user.id, name: user.name, email: user.email, phone: user.phone,
        role: user.role, schoolId: user.schoolId,
        school: user.school ? { id: user.school.id, name: user.school.name, code: user.school.code } : null,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwt.verifyAsync(dto.refreshToken);
      if (payload.type !== 'refresh') throw new Error();
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user?.isActive || !user.refreshTokenHash) throw new Error();
      if (!(await bcrypt.compare(dto.refreshToken, user.refreshTokenHash))) throw new Error();
      return this.tokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }
}
