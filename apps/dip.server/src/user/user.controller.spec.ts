import { CookieOptions, Response } from 'express';

/* eslint-disable */
import { generateAnswer } from '@/common/helpers/generate-answer';
import {
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import configModule from '../base/config.module';
import typeOrmModule from '../base/type-orm.module';
import { UserController } from './user.controller';
import { UserModule } from './user.module';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [configModule, typeOrmModule, UserModule],
    }).compile();

    controller = module.get<UserController>(UserController);

    const userModule = module.get<UserModule>(UserModule);

    await userModule.rootUserAssurance;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(UserController);
  });

  it('login:get-question:wrong-username', () => {
    expect(
      async () =>
        await controller.getQuestion('login:get-question:wrong-username', {
          username: '......',
        }),
    ).rejects.toThrow(NotFoundException);
  });

  it('login:get-question:ok', async () => {
    const { statusCode, body } = await controller.getQuestion(
      'login:get-question:ok',
      {
        username: 'root',
      },
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toHaveLength(64);
  });

  it('login:login:not-found', () => {
    expect(
      async () =>
        await controller.login(
          'random_unknown_rid',
          {
            // @ts-ignore
            cookie(
              _name: string,
              _val: any,
              _opt: CookieOptions,
            ): Response<any, Record<string, any>> {
              return null;
            },
          },
          { answer: 'random_answer' },
        ),
    ).rejects.toThrow(NotFoundException);
  });

  it('login:login:wrong-answer', async () => {
    const { statusCode, body: question } = await controller.getQuestion(
      'login:login:wrong-answer',
      {
        username: 'root',
      },
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(question).toHaveLength(64);

    expect(
      async () =>
        await controller.login(
          'login:login:wrong-answer',
          {
            // @ts-ignore
            cookie(
              _name: string,
              _val: any,
              _opt: CookieOptions,
            ): Response<any, Record<string, any>> {
              return null;
            },
          },
          {
            answer: 'random_wrong_answer',
          },
        ),
    ).rejects.toThrow(NotAcceptableException);
  });

  it('login:login:ok', async () => {
    const { statusCode, body: question } = await controller.getQuestion(
      'login:login:ok',
      {
        username: 'root',
      },
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(question).toHaveLength(64);

    const answer = generateAnswer(question, 'password', { hashPassword: true });

    expect(
      controller.login(
        'login:login:ok',
        {
          // @ts-ignore
          cookie(
            _name: string,
            _val: any,
            _opt: CookieOptions,
          ): Response<any, Record<string, any>> {
            return null;
          },
        },
        { answer },
      ),
    ).resolves.toHaveProperty('statusCode', HttpStatus.OK);
  });
});
