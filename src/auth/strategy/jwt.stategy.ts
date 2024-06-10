import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface PayloadType {
  email: string;
  userId: string;
  role: string;
  full_name: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET || 'jwt-secret_nam_vip_pro';
    console.log('JWT Secret:', secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 1.
      ignoreExpiration: false, // 2.
      secretOrKey: process.env.JWT_SECRET || 'jwt-secret_nam_vip_pro',
    });
  }

  async validate(payload: PayloadType) {
    return {
      userId: payload.userId,
      fullName: payload.full_name,
      email: payload.email,
      role: payload.role,
    };
  };
};
