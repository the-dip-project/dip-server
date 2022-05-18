import { UserEntity } from '../entities';

export type PublicUser = Omit<UserEntity, 'secret' | 'password'>;
