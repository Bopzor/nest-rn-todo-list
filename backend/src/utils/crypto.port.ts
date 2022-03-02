export abstract class CryptoPort {
  abstract hashPassword(password: string): Promise<string>;
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
