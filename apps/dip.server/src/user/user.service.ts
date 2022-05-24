import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { UserEntity } from '@/common/entities';
import { generateAnswer } from '@/common/helpers/generate-answer';
import { randomString } from '@/common/helpers/random-string';
import {
  LoginChallenge,
  LoginQuestionCheckBody,
} from '@/common/models/login-challenge';
import { PublicUser } from '@/common/models/public-user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import _omit = require('lodash/omit');
import { byMinutes } from '@/common/helpers/timespan';
import { decode, verify } from '@/common/helpers/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '../base/config.module';

export enum AnswerValidationErrors {
  NOT_DECODABLE = 0,
  NOT_VERIFIABLE = 1,
  USER_NOT_FOUND = 2,
  EXPIRED = 3,
  WRONG = 4,
}

@Injectable()
export class UserService {
  public constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  public async generateToken(escalated: boolean, user: UserEntity) {
    return await sign(
      {
        userId: user.id,
        level: user.role,
        exp: ~~(
          (Date.now() +
            (escalated
              ? this.configService.get<number>(
                  ConfigKeys.ESCALATED_AUTH_TOKEN_EXP,
                )
              : this.configService.get<number>(ConfigKeys.AUTH_TOKEN_EXP))) /
          1000
        ),
      },
      user.secret,
    );
  }

  public async generateChallenge(user: UserEntity): Promise<LoginChallenge> {
    const challenge: LoginChallenge = {
      question: randomString(64, randomBytes(32).toString('utf-8')),
      questionCheckBody: null,
      questionCheck: null,
    };

    challenge.questionCheckBody = {
      question: challenge.question,
      exp: Date.now() + byMinutes(2),
      userId: user.id,
    };

    const signedQuestionCheck = await sign(
      challenge.questionCheckBody,
      user.secret,
    );

    challenge.questionCheck = signedQuestionCheck;

    return challenge;
  }

  public async validateAnswer(
    questionCheck: string,
    answer: string,
    escalate: boolean,
  ): Promise<AnswerValidationErrors | string> {
    let questionCheckBody: LoginQuestionCheckBody;

    try {
      questionCheckBody = (await decode<LoginQuestionCheckBody>(
        questionCheck,
      )) as LoginQuestionCheckBody;
    } catch (err) {
      return AnswerValidationErrors.NOT_DECODABLE;
    }

    const { userId, exp, question } = questionCheckBody;

    if (exp < Date.now()) return AnswerValidationErrors.EXPIRED;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) return AnswerValidationErrors.USER_NOT_FOUND;

    const { secret } = user;

    try {
      await verify(questionCheck, secret);
    } catch (err) {
      return AnswerValidationErrors.NOT_VERIFIABLE;
    }

    const correctAnswer = generateAnswer(question, user.password);

    if (correctAnswer !== answer) return AnswerValidationErrors.WRONG;

    return await this.generateToken(escalate, user);
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

  public async generateNewSecret(userId: number): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { secret: createHash('sha256').update(v4()).digest('hex') },
    );
  }
}
