import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  async createUser(user: Partial<UserEntity>) {
    try {
      const createdUser = this.repo.create(user);
      return await this.repo.save(createdUser);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getUserByUsername(username: string) {
    const user = await this.repo.findOneBy({ username });
    return user;
  }

  async getUser(username?: string, email?: string) {
    const user = await this.repo.findOne({
      where: [
        {username},
        {email}
      ]
    });
    return user;
  }
}
