import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";
import { RegisterDto } from "./dto/register-auth.dto";
import { TokenDto } from "./dto/token-auth.dto";

export interface IAuth{
    login(loginDto:LoginDto):Promise<object | InternalServerErrorException | NotFoundException>;
    register(registerDto :RegisterDto):Promise<object | InternalServerErrorException | NotFoundException>;
    loginWithGoogle(tokenDto: TokenDto) : Promise<object | InternalServerErrorException | NotFoundException>;
}