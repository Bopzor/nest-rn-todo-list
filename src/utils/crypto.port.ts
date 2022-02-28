export abstract class CryptoPort {
  abstract hashPassword(password: string): Promise<string>;
}
