import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(email: string, password: string) {
    const user = await this.userService.findAll(email);
    if (user.length) {
      throw new BadRequestException('Email in use');
    }

    // generate salt for hash. randomBytes generates a random buffer(i.e 0 and 1s) of given size. toString converts it to 'jsakfjaga...'
    const salt = randomBytes(8).toString('hex');

    // scrypt for hashing the password with salt and returning a promise of size 32bytes
    // Note that ts has no idea of the result of scrypt
    const hashed = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hashed.toString('hex');

    const newUser = await this.userService.create(email, result);
    return newUser;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.findAll(email);

    if (!user) {
      throw new NotFoundException('No user found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
