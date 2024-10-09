import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/utils/auth/auth-validator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const login = await this.authService.register(registerDto);
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'User has been created successfully',
      ...login,
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
    @Res() res: Response,
  ): Promise<void> {
    const signIn = await this.authService.signIn(signInDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      ...signIn,
    });
  }
}
