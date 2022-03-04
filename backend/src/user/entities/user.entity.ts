import { Field, ObjectType } from '@nestjs/graphql';

type UserAttributes = {
  id: string;
  username: string;
  hashedPassword: string;
  lastName: string;
  firstName: string;
  token?: string;
};

@ObjectType()
export class User {
  @Field()
  readonly id: string;

  @Field()
  readonly username: string;

  readonly hashedPassword: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly firstName: string;

  @Field((type) => String, { nullable: true })
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
