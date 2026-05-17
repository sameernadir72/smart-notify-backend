import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // Look for the token in the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use the exact same secret key we used to lock the token!
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default',
    });
  }

  async validate(payload: any) {
    console.log('🔥 JWT STRATEGY HIT:', payload);

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
