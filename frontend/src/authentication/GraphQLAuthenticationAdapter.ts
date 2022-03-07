import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { ISignupUserDto, IUserDto } from 'todo-shared';
import { Mutation, MutationSignupArgs } from 'todo-shared/graphql';

import { AuthenticationPort } from './AuthenticationPort';

export class GraphQLAuthenticationAdapter implements AuthenticationPort {
  constructor(private readonly apolloClient: ApolloClient<NormalizedCacheObject>) {}

  async signup(user: ISignupUserDto): Promise<IUserDto> {
    try {
      const result = await this.apolloClient.mutate<Mutation['signup'], MutationSignupArgs>({
        mutation: gql`
          mutation Signup($user: CreateUserDto!) {
            signup(user: $user) {
              username
              firstName
              lastName
              token
            }
          }
        `,
        variables: {
          user,
        },
      });

      console.log(result);

      if (!result.data) {
        throw new Error();
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
