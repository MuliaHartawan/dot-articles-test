import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '553787449397-clfdg6htfqtnollfb8fgljggpde0o2nu.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      username: emails[0].value.split('@')[0],
      email: emails[0].value,
      fullName: name.givenName,
      avatarUrl: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
