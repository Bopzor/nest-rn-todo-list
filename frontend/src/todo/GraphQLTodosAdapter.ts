import { ApolloClient, ApolloLink, gql, HttpLink, NextLink, NormalizedCacheObject, Operation } from '@apollo/client';
import { ICreateTodoDto, ITodoDto } from 'todo-shared';
import { Mutation, MutationCreateTodoArgs, Query } from 'todo-shared/graphql';

import { TodosPort } from './TodosPort';

export class GraphQLTodosAdapter implements TodosPort {
  constructor(private readonly apolloUri: string, private readonly apolloClient: ApolloClient<NormalizedCacheObject>) {}

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

  async createTodo(token: string, todo: ICreateTodoDto): Promise<ITodoDto> {
    try {
      this.setAuthorizationHeaderForApolloClient(token);

      const result = await this.apolloClient.mutate<Mutation['createTodo'], MutationCreateTodoArgs>({
        mutation: gql`
          mutation CreateTodo($todo: CreateTodoDto!) {
            createTodo(todo: $todo) {
              title
              description
              checked
            },
            variables: {
              todo
            }
        `,
      });

      if (!result.data) {
        throw new Error();
      }

      return { ...result.data, description: todo.description ?? undefined };
    } catch (error) {
      throw error;
    }
  }

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
}
