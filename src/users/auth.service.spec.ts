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
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'email@email.com', password: '1' } as User,
      ]);

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
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'email@email.com', password: 'adsfdf23sdssd' } as User,
      ]);

    try {
      await service.signin('email@email.com', 'password');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toBe('Bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'email@email.com',
          password:
            'd866170d8d510a69.3a70d57efc2e0f45a6c2a08d695f51e774a2d43686403b57c5d4a293e623ec6b',
        } as User,
      ]);

    const user = await service.signin('email@email.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
