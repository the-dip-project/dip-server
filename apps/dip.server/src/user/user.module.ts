import { UserEntity } from '@/common/entities';
import { Logger, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  private readonly logger: Logger = new Logger('UserModule');

  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {
    this.assureRootUserExists();
  }

  private async assureRootUserExists(): Promise<void> {
    const rootUser = await this.userRepository.findOne({
      where: { username: 'root' },
    });

    if (!rootUser) {
      const { id } = await this.userService.createUser('root', 'password', 0);

      this.logger.log('Root user created with id: ' + id);
    }
  }
}
