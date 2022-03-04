import { ClassProvider, Module } from '@nestjs/common';

import { StubCryptoAdapter } from 'src/tests/stub-crypto.adapter';

import { BcryptCryptoAdapter } from './bcrypt-crypto.adapter';
import { CryptoPort } from './crypto.port';

const cryptoProvider: ClassProvider<CryptoPort> = {
  provide: CryptoPort,
  useClass: process.env.NODE_ENV !== 'test' ? BcryptCryptoAdapter : StubCryptoAdapter,
};

@Module({
  providers: [cryptoProvider],
  exports: [cryptoProvider],
})
export class CryptoModule {}
