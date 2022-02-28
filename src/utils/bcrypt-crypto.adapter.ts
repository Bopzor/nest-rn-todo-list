import * as bcrypt from 'bcrypt';

import { CryptoPort } from './crypto.port';

export class BcryptCryptoAdapter implements CryptoPort {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
