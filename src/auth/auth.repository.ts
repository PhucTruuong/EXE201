import { Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IAuth } from "./auth.interface";
import { LoginDto } from "./dto/login-dto";
import { User } from "src/database/dabaseModels/user.entity";
import { bcryptModule } from 'src/utils/bcryptModule';
import { PayloadType } from "./types/payload.types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthRepository implements IAuth {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private readonly userModel: typeof User,
        private readonly bcryptUtils: bcryptModule,
        private readonly jwtService: JwtService,

    ) {

    }
    public async login(loginDto: LoginDto): Promise<object | InternalServerErrorException | NotFoundException> {
        try {
            const user = await this.userModel.findOne({
                where: {
                    email: loginDto.email,
                },
            })
            if (!user) {
                throw new NotFoundException('User not found!');
            }
            const passwordMatch = await this.bcryptUtils.compare(
                loginDto.password,
                user.password_hashed
            )
            console.log("password check", passwordMatch)
            if (!passwordMatch) {
                throw new UnauthorizedException('Password not match!');
            }
            const payload: PayloadType = { email: user.email, userId: user.user_id, full_name: user.full_name }; // 1
            return {
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                },
                accessToken: this.jwtService.sign(payload)
            }
        } catch (error) {
            console.log("error from login", error)
            throw new InternalServerErrorException;
        }

    }
}
