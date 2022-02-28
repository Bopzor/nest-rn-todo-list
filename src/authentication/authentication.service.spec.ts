import { StubCryptoAdapter } from '../tests/stub-crypto.adapter';
import { StubGeneratorAdapter } from '../tests/stub-generator.adapter';
import { createUser } from '../tests/factories';
import { InMemoryUserRepository } from '../tests/in-memory-user.repository';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    const crypto = new StubCryptoAdapter();
    const generator = new StubGeneratorAdapter();

    authenticationService = new AuthenticationService(userRepository, crypto, generator);
  });

  describe('signup', () => {
    it('creates a user', async () => {
      const createdUser = await authenticationService.createUser({
        username: 'azot',
        lastName: 'Toza',
        firstName: 'Azot',
        password: 'password',
      });
      const expectedUser = createUser({ token: 'token' });

      expect(createdUser).toMatchObject(expectedUser);

      expect(userRepository.users[0]).toMatchObject({
        id: expectedUser.id,
      });
    });
  });
});
