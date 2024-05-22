import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register-auth.dto';
import { TokenDto } from './dto/token-auth.dto';

@Injectable()
export class AuthService {
   constructor(private readonly authRepository: AuthRepository) { }
   public async login(loginDto: LoginDto): Promise<object | InternalServerErrorException | NotFoundException> {
      return this.authRepository.login(loginDto)

   }
   public async register(registerDto: RegisterDto): Promise<object | InternalServerErrorException | NotFoundException> {
      return this.authRepository.register(registerDto)

   }
   public async loginWithGoogle(tokenDto: TokenDto): Promise<object | InternalServerErrorException | NotFoundException> {
      return this.authRepository.loginWithGoogle(tokenDto)
   }
}
