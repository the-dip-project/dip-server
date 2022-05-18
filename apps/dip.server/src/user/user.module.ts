import { Repository } from 'typeorm';

import { UserEntity } from '@/common/entities';
import { byMinutes } from '@/common/helpers/timespan';
import {
  CacheModule,
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuardMiddleware } from '../auth-guard/auth-guard.middleware';
import { AuthGuardModule } from '../auth-guard/auth-guard.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register({ ttl: byMinutes(2) }),
    AuthGuardModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  private readonly logger: Logger = new Logger(UserModule.name);
  public readonly rootUserAssurance: Promise<void>;

  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {
    this.rootUserAssurance = this.assureRootUserExists();
  }

  private async assureRootUserExists(): Promise<void> {
    const rootUser = await this.userRepository.findOne({
      where: { username: 'root', role: 0 },
    });

    if (!rootUser) {
      const { id } = await this.userService.createUser(
        'root',
        'Administrator',
        'password',
        0,
      );

      this.logger.log('Root user created with id: ' + id);
    }
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuardMiddleware)
      .exclude({ path: '/api/user/login', method: RequestMethod.ALL })
      .forRoutes(
        { path: '/api/user', method: RequestMethod.ALL },
        { path: '/api/user/*', method: RequestMethod.ALL },
      );
  }
}
