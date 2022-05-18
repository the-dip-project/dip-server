import { createHash } from 'crypto';
import { UserEntity } from '@/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(
    username: string,
    password: string,
    role: number,
  ): Promise<UserEntity> {
    return (
      await this.userRepository.insert({
        username,
        password: createHash('sha256').update(password).digest('hex'),
        role,
        secret: createHash('sha256').update(v4()).digest('hex'),
        creationDate: Date.now(),
      })
    ).generatedMaps[0] as UserEntity;
  }
}
