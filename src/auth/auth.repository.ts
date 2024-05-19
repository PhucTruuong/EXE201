import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IAuth } from "./auth.interface";
import { LoginDto } from "./dto/login-dto";
import { User } from "src/database/dabaseModels/user.entity";
import { bcryptModule } from 'src/utils/bcryptModule';
import { PayloadType } from "./types/payload.types";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register-auth.dto";
import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize";

@Injectable()
export class AuthRepository implements IAuth {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private readonly userModel: typeof User,
        private readonly bcryptUtils: bcryptModule,
        private readonly jwtService: JwtService,

    ) {

    }
    public async register(registerDto: RegisterDto): Promise<object | InternalServerErrorException | NotFoundException> {
        try {
            const existingUser = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { email: registerDto.email },
                        { phone_number: registerDto.phone_number }
                    ]
                }
            });
            if (existingUser) {
                throw new ConflictException(
                    `The user has the email ${registerDto.email} or the phone number ${registerDto.phone_number} had already exists!`
                );
            }
            const pwd = await this.bcryptUtils.getHash(registerDto.password);
            const user = await this.userModel.create({
                user_id: uuidv4(),
                full_name: registerDto.full_name,
                email: registerDto.email,
                phone_number: registerDto.phone_number,
                account_status: true,
                role_id: "1f03ec61-2b39-49a0-aafc-5dd845b915a8",
                password_hashed: pwd,
                created_at: new Date(),
                updated_at: new Date(),
            })
            return user;
        } catch (error) {
            console.log("error from auth/register", error)
            throw new InternalServerErrorException;
        }

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
            const payload: PayloadType = {
                email: user.email, userId: user.user_id, full_name: user.full_name,
                role: user.role_id
            }; // 1
            return {
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role_id
                },
                accessToken: this.jwtService.sign(payload)
            }
        } catch (error) {
            console.log("error from login", error)
            throw new InternalServerErrorException;
        }

    }
}
