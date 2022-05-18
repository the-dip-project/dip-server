import { Cache } from 'cache-manager';
import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { UserEntity } from '@/common/entities';
import { generateAnswer } from '@/common/helpers/generate-answer';
import { randomString } from '@/common/helpers/random-string';
import { LoginChallenge } from '@/common/models/login-challenge';
import { PublicUser } from '@/common/models/public-user';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import _omit = require('lodash/omit');

export enum AnswerValidationErrors {
  NOT_FOUND = 0,
  INVALID = 1,
}

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  public async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  public async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  public async generateChallenge(
    requestId: string,
    user: UserEntity,
  ): Promise<LoginChallenge> {
    const challenge: LoginChallenge = {
      requestId,
      question: '',
      answer: '',
      presignedToken: await sign(
        {
          userId: user.id,
          level: user.role,
        },
        user.secret,
        { expiresIn: '1h' },
      ),
    };

    challenge.question = randomString(64, randomBytes(32).toString('utf-8'));
    challenge.answer = generateAnswer(challenge.question, user.password);

    this.cacheManager.set(requestId, challenge);

    return { ...challenge };
  }

  public async validateAnswer(
    requestId: string,
    answer: string,
  ): Promise<AnswerValidationErrors | string> {
    const challenge = await this.cacheManager.get<LoginChallenge>(requestId);

    if (!challenge) return AnswerValidationErrors.NOT_FOUND;

    if (challenge.answer === answer) {
      this.cacheManager.del(requestId);
      return challenge.presignedToken;
    }

    return AnswerValidationErrors.INVALID;
  }

  public async createUser(
    username: string,
    displayName: string,
    password: string,
    role: number,
  ): Promise<UserEntity> {
    return (
      await this.userRepository.insert({
        username,
        password: createHash('sha256').update(password).digest('hex'),
        role,
        secret: createHash('sha256').update(v4()).digest('hex'),
        displayName,
        creationDate: Date.now(),
      })
    ).generatedMaps[0] as UserEntity;
  }

  public reduceUser(user: UserEntity): PublicUser {
    return _omit(user, 'secret', 'password');
  }
}
