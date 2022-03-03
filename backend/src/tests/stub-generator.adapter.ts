import { GeneratorPort } from '../utils/generator.port';

export class StubGeneratorAdapter implements GeneratorPort {
  generateId(): string {
    return 'id';
  }

  generateToken(_payload: { username: string; userId: string }): string {
    return 'token';
  }
}
