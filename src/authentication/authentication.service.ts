import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import jwt, { type SignOptions } from 'jsonwebtoken';
import env from '../common/config/env.config';
import { type databaseSchema, refreshTokensTable } from '../database/database.schema';
import { DrizzleService } from '../database/drizzle.service';
import type { UserService } from '../user/user.service';
import { HttpException } from '../utils/http-exception';
import type { JwtPayload } from './interfaces/jwt.interface';
import type { SignInDto, SignUpDto } from './schemas/authentication.dto';

export class AuthenticationService {
  private db: NodePgDatabase<typeof databaseSchema>;

  constructor(private readonly userService: UserService) {
    this.db = DrizzleService.getInstance().getDb();
  }

  private async verifyUserPassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      throw new HttpException(401, 'Wrong credentials');
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new HttpException(401, 'Wrong credentials');
    }
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new HttpException(401, 'User not found');
    }
    return user;
  }

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await bcrypt.hash(password, env.saltRounds);
    return this.userService.create({
      email,
      password: hashedPassword,
    });
  }

  async getRefreshToken(token: string) {
    const storedToken = (
      await this.db.select().from(refreshTokensTable).where(eq(refreshTokensTable.token, token))
    ).pop();

    if (!storedToken) {
      throw new HttpException(401, 'Token not found');
    }

    if (new Date() > storedToken.expiresAt) {
      await this.killToken(token);
      throw new HttpException(401, 'Token expired');
    }

    return storedToken;
  }

  async killToken(token: string) {
    await this.db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, token));
  }

  async getAuthenticatedUser(signInData: SignInDto) {
    const user = await this.getUserByEmail(signInData.email);
    await this.verifyUserPassword(signInData.password, user.password);
    return user;
  }

  async createRefreshToken(userId: number, email: string, currentRefreshToken?: string) {
    if (currentRefreshToken) {
      this.killToken(currentRefreshToken);
    }
    const payload: JwtPayload = { userId, email };

    const refreshToken = jwt.sign(payload, env.jwt.refreshSecretKey, {
      expiresIn: env.jwt.refreshExpirationTime,
    } as SignOptions);

    const expiresAt = new Date();
    expiresAt.setMilliseconds(expiresAt.getMilliseconds() + Number(env.jwt.refreshExpirationTime));

    await this.db.insert(refreshTokensTable).values({ userId, token: refreshToken, expiresAt });

    return {
      refreshToken,
      refreshTokenExpiration: Number(env.jwt.refreshExpirationTime),
    };
  }

  createAccessToken(userId: number, email: string) {
    const payload: JwtPayload = { userId, email };
    const accessToken = jwt.sign(payload, env.jwt.accessSecretKey, {
      expiresIn: env.jwt.accessExpirationTime,
    } as SignOptions);

    return {
      accessToken,
      accessTokenExpiration: Number(env.jwt.accessExpirationTime),
    };
  }
}
