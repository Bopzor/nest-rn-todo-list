export class NotMatchingPatternError extends Error {
  constructor(field: string, pattern: string) {
    super(`${field} must match ${pattern} `);
  }
}
