import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

import { createUser } from 'src/tests/factories';
import { InMemoryUserRepository } from 'src/tests/in-memory-user.repository';
import { RequestWithUser } from 'src/utils/request-with-user';

import { User } from '../entities/user.entity';

import { UserMiddleware } from './user.middleware';

describe('UserMiddleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockReset();
  });

  it('adds the user to the request if Bearer token match', async () => {
    const userRepository = new InMemoryUserRepository();
    const userMiddleware = new UserMiddleware(userRepository);

    const user = new User(createUser({ token: 'token' }));
    userRepository.save(user);

    const req = { headers: { authorization: `Bearer ${user.token}` } } as unknown as RequestWithUser;
    const res = {} as Response;

    await userMiddleware.use(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('calls next without adding the user if no authorization header is set', async () => {
    const userRepository = new InMemoryUserRepository();
    const userMiddleware = new UserMiddleware(userRepository);

    const user = new User(createUser({ token: 'token' }));
    userRepository.save(user);

    const req = { headers: {} } as unknown as RequestWithUser;
    const res = {} as Response;

    await userMiddleware.use(req, res, next);

    expect(req.user).toBe(undefined);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('throws an Unauthorized error if the token does not match', async () => {
    const userRepository = new InMemoryUserRepository();
    const userMiddleware = new UserMiddleware(userRepository);

    const user = new User(createUser({ token: 'token' }));
    userRepository.save(user);

    const req = { headers: { authorization: 'Bearer wrong token' } } as unknown as RequestWithUser;
    const res = {} as Response;

    await expect(() => userMiddleware.use(req, res, next)).rejects.toThrow(new UnauthorizedException('invalid token'));

    expect(next).not.toHaveBeenCalled();
  });

  it('throws an Unauthorized error if the authorization header is set wrong format', async () => {
    const userRepository = new InMemoryUserRepository();
    const userMiddleware = new UserMiddleware(userRepository);

    const user = new User(createUser({ token: 'token' }));
    userRepository.save(user);

    const req = { headers: { authorization: 'wrong format' } } as unknown as RequestWithUser;
    const res = {} as Response;

    await expect(() => userMiddleware.use(req, res, next)).rejects.toThrow(new UnauthorizedException('invalid token'));

    expect(next).not.toHaveBeenCalled();
  });
});
