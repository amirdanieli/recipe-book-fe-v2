import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../utils/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { token, user } = await this.authService.login(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { token, user };
  }

  @Post('admin/logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/verify')
  verify(@Req() req: AuthenticatedRequest) {
    return { user: req.user };
  }
}
