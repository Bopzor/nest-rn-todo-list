export class TooShortError extends Error {
  constructor(field: string, minLength: number) {
    super(`${field} must be at least ${minLength} characters`);
  }
}
