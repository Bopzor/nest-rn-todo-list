type UserAttributes = {
  id: string;
  username: string;
  hashedPassword: string;
  lastName: string;
  firstName: string;
  token?: string;
};

export class User {
  readonly id: string;
  readonly username: string;
  readonly hashedPassword: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly token?: string;

  constructor(attributes: UserAttributes) {
    this.id = attributes.id;
    this.username = attributes.username;
    this.hashedPassword = attributes.hashedPassword;
    this.lastName = attributes.lastName;
    this.firstName = attributes.firstName;
    this.token = attributes.token;
  }
}
