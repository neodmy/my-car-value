import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create UsersService mock with the functions AuthService needs from it
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    // Create DI Container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService); // create an instance with its dependencies
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('email@email.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if users signs up with email that is in use', async () => {
    await service.signup('email@email.com', 'password');
    try {
      await service.signup('email@email.com', 'password');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('email@email.com', 'password');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('email@email.com', 'password');

    try {
      await service.signin('email@email.com', 'password1');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toBe('Bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('email@email.com', 'mypassword');

    const user = await service.signin('email@email.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
