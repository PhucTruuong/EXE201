import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";

export interface IAuth{
    login(loginDto:LoginDto):Promise<object | InternalServerErrorException | NotFoundException>;
}