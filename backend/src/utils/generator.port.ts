export abstract class GeneratorPort {
  abstract generateId(): string;
  abstract generateToken(payload: { username: string; userId: string }): string;
}
