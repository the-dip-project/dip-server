import { Repository } from 'typeorm';

import { UserEntity } from '@/common/entities';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
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
}
