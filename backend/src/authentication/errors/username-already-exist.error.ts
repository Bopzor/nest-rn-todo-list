export class UsernameAlreadyExistError extends Error {
  constructor(username: string) {
    super(`Username ${username} is already taken`);
  }
}
