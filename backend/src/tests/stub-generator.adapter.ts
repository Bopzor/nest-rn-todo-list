import { GeneratorPort } from '../utils/generator.port';

export class StubGeneratorAdapter implements GeneratorPort {
  generateId(): string {
    return 'id';
  }

  generateToken(): string {
    return 'token';
  }
}
