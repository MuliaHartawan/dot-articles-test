import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import e from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new NotFoundException('Oops! user already exist');
    }

    try {
      await this.usersService.store(registerDto);
    } catch (error) {
      throw new InternalServerErrorException('Oops! something went wrong');
    }
  }

  async signIn(signInDto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException('Oops! user not found');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.full_name,
      avatar: user.avatar_url,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }
}
