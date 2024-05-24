import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthRepository } from './auth.repository';
import { UserProviders } from 'src/user/user.provider';
import { bcryptModule } from 'src/utils/bcryptModule';
import { RoleProviders } from 'src/role/role.provider';
import { AuthProviders } from './auth.provider';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.stategy';
import { firebaseProviders } from 'src/firebase/firebase.provider';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "jwt-secret_nam_vip_pro",
      signOptions: {
        expiresIn: '7d'
      }
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    UserRepository,
    AuthRepository,
    bcryptModule,
    ...firebaseProviders,
    ...UserProviders,
    ...RoleProviders,
    ...AuthProviders,
  ],
})
export class AuthModule { }
