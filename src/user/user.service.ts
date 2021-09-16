import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async findById(id) {
  //   // this is applicable for signing out as if id = null, we get back the first user in db with find()
  //   // if (!id) {
  //   //   return null;
  //   // }
  //   const user = await this.userRepository.findOne({ id });
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return user;
  // }

  async create(email, password) {
    const user = this.userRepository.create({ email, password });
    return await this.userRepository.save(user);
  }

  async findOne(id: number) {
    // this is applicable for signing out as if id = null, we get back the first user in db with find()
    if (!id) {
      return null;
    }
    return this.userRepository.findOne(id);
  }

  async findAll(email: string) {
    const users = await this.userRepository.find({ email });
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return await this.userRepository.remove(user);
  }
}
