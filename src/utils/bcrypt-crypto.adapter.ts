import * as bcrypt from 'bcrypt';

import { CryptoPort } from './crypto.port';

export class BcryptCryptoAdapter implements CryptoPort {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
