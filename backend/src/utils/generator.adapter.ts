import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { GeneratorPort } from './generator.port';

export class GeneratorAdapter implements GeneratorPort {
  generateId(): string {
    return uuid();
  }

  generateToken(payload: { username: string; userId: string }): string {
    return jwt.sign(payload, process.env.JWT_SECRET ?? 'secret');
  }
}
