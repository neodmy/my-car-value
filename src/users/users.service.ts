import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // @InjectRepository(User) -> indicates to the DI container to use the User repository because of the use of generics
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // Generate an instance from then entity but don't persist it
    // We can implement validation and TypeORM hooks on the entity class
    const user = this.repo.create({ email, password });

    // Persists the instance. Executes hooks on the entity (as opposed to insert)
    return this.repo.save(user);
  }
}
