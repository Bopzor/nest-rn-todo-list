import { ClassProvider, Module } from '@nestjs/common';

import { BcryptCryptoAdapter } from './bcrypt-crypto.adapter';
import { CryptoPort } from './crypto.port';

const cryptoProvider: ClassProvider<CryptoPort> = {
  provide: CryptoPort,
  useClass: BcryptCryptoAdapter,
};

@Module({
  providers: [cryptoProvider],
  exports: [cryptoProvider],
})
export class CryptoModule {}
