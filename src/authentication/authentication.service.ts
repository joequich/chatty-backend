import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { EnvConfig } from '../common/config/env.config';
import { usersSessionsTable } from '../database/database.schema';
import type { Database, DrizzleService } from '../database/drizzle.service';
import type { UserService } from '../user/user.service';
import { HttpException } from '../utils/http-exception';
import type { JwtPayload } from './interfaces/jwt.interface';
import type { SignInDto, SignUpDto } from './schemas/authentication.dto';

export class AuthenticationService {
  private db: Database;
  constructor(
    private readonly env: EnvConfig,
    private readonly drizzleService: DrizzleService,
    private readonly userService: UserService,
  ) {
    this.db = this.drizzleService.getDb();
  }

  private async verifyUserPassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      throw new HttpException(401, 'Wrong credentials');
    }
  }

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await bcrypt.hash(password, this.env.saltRounds);
    return this.userService.create({
      email,
      password: hashedPassword,
    });
  }

  async getRefreshToken(token: string) {
    const storedToken = (
      await this.db
        .select()
        .from(usersSessionsTable)
        .where(eq(usersSessionsTable.token, token))
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

  async getUserByAccessToken(accessToken: string) {
    try {
      const jwtDecoded = jwt.verify(
        accessToken,
        this.env.jwt.accessSecretKey,
      ) as JwtPayload;
      return await this.userService.getByEmail(jwtDecoded.email);
    } catch (error) {
      throw new HttpException(401, 'Invalid or expired access token');
    }
  }

  async getUserByRefreshToken(refreshToken: string) {
    try {
      const jwtDecoded = jwt.verify(
        refreshToken,
        this.env.jwt.refreshSecretKey,
      ) as JwtPayload;
      return await this.userService.getByEmail(jwtDecoded.email);
    } catch (error) {
      throw new HttpException(401, 'Invalid or expired access token');
    }
  }

  async killToken(token: string) {
    await this.db
      .delete(usersSessionsTable)
      .where(eq(usersSessionsTable.token, token));
  }

  async getAuthenticatedUser(signInData: SignInDto) {
    try {
      const user = await this.userService.getByEmail(signInData.email);
      await this.verifyUserPassword(signInData.password, user.password);
      return user;
    } catch (error) {
      throw new HttpException(401, 'Wrong credentials');
    }
  }

  async createRefreshToken(
    userId: string,
    email: string,
    currentRefreshToken?: string,
  ) {
    if (currentRefreshToken) {
      this.killToken(currentRefreshToken);
    }
    const payload: JwtPayload = { userId, email };

    const refreshToken = jwt.sign(payload, this.env.jwt.refreshSecretKey, {
      expiresIn: this.env.jwt.refreshExpirationTime,
    } as SignOptions);

    const expiresAt = new Date();
    expiresAt.setMilliseconds(
      expiresAt.getMilliseconds() + Number(this.env.jwt.refreshExpirationTime),
    );

    await this.db
      .insert(usersSessionsTable)
      .values({ userId, token: refreshToken, expiresAt });

    return {
      refreshToken,
      refreshTokenExpiration: Number(this.env.jwt.refreshExpirationTime),
    };
  }

  createAccessToken(userId: string, email: string) {
    const payload: JwtPayload = { userId, email };
    const accessToken = jwt.sign(payload, this.env.jwt.accessSecretKey, {
      expiresIn: this.env.jwt.accessExpirationTime,
    } as SignOptions);

    return {
      accessToken,
      accessTokenExpiration: Number(this.env.jwt.accessExpirationTime),
    };
  }
}
