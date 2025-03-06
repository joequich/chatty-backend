import type { CreateUserDto } from './user.dto';

export type SignUpDto = Omit<CreateUserDto, 'createdAt'>;
