import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      console.log('existingUser', existingUser);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword: string = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    console.log('user', user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const accessToken = await this.generateToken(user.id);
    console.log(
      `new registeration issued: ${user.email} ${new Date().toUTCString()}}`,
    );

    return {
      user: result,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const accessToken = await this.generateToken(user.id);
    console.log(`new login issued: ${user.email} ${new Date().toUTCString()}`);

    return {
      user: result,
      accessToken,
    };
  }

  private async generateToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId });
  }
}
