import { BadRequestException, Injectable } from '@nestjs/common';
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
}
