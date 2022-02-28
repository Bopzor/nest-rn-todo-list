export class InvalidCredentialsError extends Error {
  constructor() {
    super('Given credentials are not valid');
  }
}
