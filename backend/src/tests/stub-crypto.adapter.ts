import { CryptoPort } from 'src/utils/crypto.port';

export class StubCryptoAdapter implements CryptoPort {
  async hashPassword(_password: string): Promise<string> {
    return 'hashedPassword';
  }

  async compare(password: string, _hashedPassword: string): Promise<boolean> {
    return password === 'p4ssWord';
  }
}
