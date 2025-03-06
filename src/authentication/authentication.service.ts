import bcrypt from 'bcrypt';
import type { SignUpDto } from '../dto/sign-up.dto';
import type { UserService } from '../user/user.service';

const SALT_ROUNDS = 10;

export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return this.userService.create({
      email,
      password: hashedPassword,
    });
  }
}
