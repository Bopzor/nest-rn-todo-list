import { CryptoPort } from '../utils/crypto.port';

export class StubCryptoAdapter implements CryptoPort {
  async hashPassword(_password: string): Promise<string> {
    return 'hashedPassword';
  }
}
