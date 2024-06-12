import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';
import { IAuth } from './auth.interface';
import { LoginDto } from './dto/login-dto';
import { User } from 'src/database/dabaseModels/user.entity';
import { bcryptModule } from 'src/utils/bcryptModule';
import { PayloadType } from './types/payload.types';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
// import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import * as admin from 'firebase-admin';
import { TokenDto } from './dto/token-auth.dto';
import { Role } from 'src/database/dabaseModels/role.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateWay } from 'src/notification/notification.gateway';


@Injectable()
export class AuthRepository implements IAuth {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly userModel: typeof User,
    private readonly bcryptUtils: bcryptModule,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateWay,

    // @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) { }

  private generateRandomPhoneNumber(length: number): string {
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    return digits;
  }
  

  private async verifyGoogle(idToken: string) {
    const decodedUser: UserRecord = await this.verifyTokenFromClient(idToken);
    const user = {
      email: decodedUser.email,
      name: decodedUser.displayName,
      avatar: decodedUser.photoURL,
    };

    return user;
  }

  private async verifyTokenFromClient(idToken: string) {
    try {
      console.log('Verifying ID token:', idToken);
      const decodedIdToken = await this.firebaseApp
        .auth()
        .verifyIdToken(idToken);
      console.log('Decoded ID token:', decodedIdToken);

      const userRecord = await this.firebaseApp
        .auth()
        .getUser(decodedIdToken.uid);
      return userRecord;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async register(
    registerDto: RegisterDto,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    try {
      const existingUser = await this.userModel.findOne({
        where: {
          [Op.or]: [
            { email: registerDto.email },
            { phone_number: registerDto.phone_number },
          ],
        },
      });
      if (existingUser) {
        return new ConflictException(
          `The user has the email ${registerDto.email} or the phone number ${registerDto.phone_number} had already exists!`,
        );
      }
      const pwd = await this.bcryptUtils.getHash(registerDto.password);
      const user = await this.userModel.create({
        user_id: uuidv4(),
        full_name: registerDto.full_name,
        email: registerDto.email,
        phone_number: registerDto.phone_number,
        account_status: true,
        role_id: '31129e6e-6025-494a-a02d-375441ec603a',
        password_hashed: pwd,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return user;
    } catch (error) {
      console.log('error from auth/register', error);
      throw new InternalServerErrorException();
    }
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<
    object |
    InternalServerErrorException |
    NotFoundException |
    ForbiddenException
  > {
    try {
      console.log('loginDto: ', loginDto)
      const user = await this.userModel.findOne({
        attributes: ['user_id', 'full_name', 'email', 'password_hashed', 'account_status'],
        where: {
          email: loginDto.email,
        },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['role_name'],
          },
        ],
      });

      // console.log('User: ', user);

      // console.log('Role Name: ', user.dataValues.role.role_name);
      if (!user) {
        return new NotFoundException('User not found!');
      };

      if (user.account_status === false) {
        return new ForbiddenException('This account is not active!');
      }
      const passwordMatch = await this.bcryptUtils.compare(
        loginDto.password,
        user.password_hashed,
      );
      console.log('password check: ', passwordMatch);

      if (!passwordMatch) {
        return new UnauthorizedException('Password not match!');
      }
      const payload: PayloadType = {
        email: user.email,
        userId: user.user_id,
        full_name: user.full_name,
        role: user.dataValues.role.role_name,
      }; // 1
      return {
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.dataValues.role.role_name,
        },
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log('error from login', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginWithGoogle(
    tokenDto: TokenDto,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    console.log('idToken', tokenDto.idToken);
    const userRecord = await this.verifyGoogle(tokenDto.idToken);
    console.log(userRecord);

    const userExists = await this.userModel.findOne({
      where: { email: userRecord.email },
    });

    if (!userExists) {
      const newUser = await this.userModel.create({
        user_id: uuidv4(),
        full_name: userRecord.name,
        email: userRecord.email,
        phone_number: this.generateRandomPhoneNumber, // random phone 12 ch
        account_status: true,
        role_id: '31129e6e-6025-494a-a02d-375441ec603a',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: userRecord.avatar,
      });

      const payload: PayloadType = {
        email: newUser.email,
        userId: newUser.user_id,
        full_name: newUser.full_name,
        role: newUser.role_id,
      }; // 1

      return {
        user: {
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role_id,
        },
        accessToken: this.jwtService.sign(payload),
      };
    }

    const payload: PayloadType = {
      email: userExists.email,
      userId: userExists.user_id,
      full_name: userExists.full_name,
      role: userExists.role_id,
    }; // 1

    return {
      user: {
        user_id: userExists.user_id,
        full_name: userExists.full_name,
        email: userExists.email,
        role: userExists.role_id,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
  async loginWithGoogleMobile(
    userInfo: any,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    const existingUser = await this.userModel.findOne({
      where: { email: userInfo.email },
      attributes: ['user_id', 'full_name', 'email', 'password_hashed', 'account_status'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_name'],
        },
      ],

    });
    if (!existingUser) {
      const newUser = await this.userModel.create({
        user_id: uuidv4(),
        full_name: userInfo.name,
        email: userInfo.email,
        phone_number: this.generateRandomPhoneNumber(12), // random phone 12 ch
        account_status: true,
        role_id: '31129e6e-6025-494a-a02d-375441ec603a',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: userInfo.photoUrl,
      });
      const payload: PayloadType = {
        email: newUser.email,
        userId: newUser.user_id,
        full_name: newUser.full_name,
        role: newUser.dataValues.role.role_name,
      }; // 1

      return {
        user: {
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.dataValues.role.role_name,

        },
        accessToken: this.jwtService.sign(payload),
      };
    }

    const payload: PayloadType = {
      email: existingUser.email,
      userId: existingUser.user_id,
      full_name: existingUser.full_name,
      role: existingUser.dataValues.role.role_name,

    }; // 1

    return {
      user: {
        user_id: existingUser.user_id,
        full_name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.dataValues.role.role_name,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
