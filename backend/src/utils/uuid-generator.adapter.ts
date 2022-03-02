import { v4 as uuid } from 'uuid';

import { GeneratorPort } from './generator.port';

export class UUIDGeneratorAdapter implements GeneratorPort {
  generateId(): string {
    return uuid();
  }

  generateToken(): string {
    return uuid();
  }
}
