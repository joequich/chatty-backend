import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { SignInDto } from '../dto/sign-in-dto';
import type { SignUpDto } from '../dto/sign-up.dto';
import env from '../env.config';
import type { UserService } from '../user/user.service';
import type { JwtPayload } from './interfaces/jwt.interface';

export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  private async getUserByEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new Error('Wrong credentials');
    }
    return user;
  }

  private async verifyUserPassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      throw new Error('Wrong credentials');
    }
  }

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await bcrypt.hash(password, env.saltRounds);
    return this.userService.create({
      email,
      password: hashedPassword,
    });
  }

  async getAuthenticatedUser(signInData: SignInDto) {
    const user = await this.getUserByEmail(signInData.email);
    await this.verifyUserPassword(signInData.password, user.password);
    return user;
  }

  getJwtTokens(userId: number, email: string) {
    const payload: JwtPayload = { userId, email };
    const accessToken = jwt.sign(payload, env.jwt.accessSecretKey, {
      expiresIn: env.jwt.accessExpirationTime,
    } as SignOptions);
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecretKey, {
      expiresIn: env.jwt.refreshExpirationTime,
    } as SignOptions);

    return {
      accessToken,
      refreshTokenExpiration: Number(env.jwt.refreshExpirationTime),
      refreshToken,
    };
  }
}
