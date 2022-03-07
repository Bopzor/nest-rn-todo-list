import { ApolloClient, ApolloLink, gql, HttpLink, NextLink, NormalizedCacheObject, Operation } from '@apollo/client';
import { ITodoDto } from 'todo-shared';
import { Query } from 'todo-shared/graphql';

import { TodosPort } from './TodosPort';

export class GraphQLTodosAdapter implements TodosPort {
  constructor(private readonly apolloUri: string, private readonly apolloClient: ApolloClient<NormalizedCacheObject>) {}

  private setAuthorizationHeaderForApolloClient(token: string) {
    const httpLink = new HttpLink({ uri: this.apolloUri });

    const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return forward(operation);
    });

    this.apolloClient.setLink(authLink.concat(httpLink));
  }

  async loadTodos(token: string): Promise<ITodoDto[]> {
    try {
      this.setAuthorizationHeaderForApolloClient(token);

      const result = await this.apolloClient.query<Query['todos']>({
        query: gql`
          query todos {
            todos {
              title
              description
              checked
            }
        `,
      });

      if (!result.data) {
        throw new Error();
      }

      return result.data.map((todo) => ({ ...todo, description: todo.description ?? undefined }));
    } catch (error) {
      throw error;
    }
  }
}
