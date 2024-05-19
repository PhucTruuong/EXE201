import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor (private readonly authRepository: AuthRepository){}
  public async login(loginDto: LoginDto):Promise<object | InternalServerErrorException | NotFoundException>{
     return this.authRepository.login(loginDto)

  }
}
