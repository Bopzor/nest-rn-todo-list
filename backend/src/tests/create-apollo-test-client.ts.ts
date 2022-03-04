import { getApolloServer } from '@nestjs/apollo';
import { TestingModule } from '@nestjs/testing';
import { ApolloServerBase } from 'apollo-server-core';
import { GraphQLResponse as GraphQLResponseType } from 'apollo-server-types';
import { print, DocumentNode } from 'graphql';
import { Headers } from 'node-fetch';

type StringOrAst = string | DocumentNode;

// A query must not come with a mutation (and vice versa).
type Query<TVariables = Record<string, any>> = {
  query: StringOrAst;
  mutation?: undefined;
  variables?: TVariables;
  operationName?: string;
  integrationContextArgument?: any;
};
type Mutation<TVariables = Record<string, any>> = {
  mutation: StringOrAst;
  query?: undefined;
  variables?: TVariables;
  operationName?: string;
  integrationContextArgument?: any;
};

type GraphQLResponse<TData> = Omit<GraphQLResponseType, 'data'> & {
  data?: TData;
};

export interface ApolloServerTestClient {
  query<TData = any, TVariables = Record<string, any>>(query: Query<TVariables>): Promise<GraphQLResponse<TData>>;
  mutate<TData = any, TVariables = Record<string, any>>(
    mutation: Mutation<TVariables>,
  ): Promise<GraphQLResponse<TData>>;
}

const createApolloTestingClient = (server: ApolloServerBase): ApolloServerTestClient => {
  const executeOperation = server.executeOperation.bind(server);
  const test = ({ query, mutation, integrationContextArgument, ...args }: Query | Mutation) => {
    const operation = query || mutation;

    if (!operation || (query && mutation)) {
      throw new Error('Either `query` or `mutation` must be passed, but not both.');
    }

    const headers = new Headers({
      authorization: 'Bearer token',
    });

    return executeOperation(
      {
        // Convert ASTs, which are produced by `graphql-tag` but not currently
        // used by `executeOperation`, to a String using `graphql/language/print`.
        query: typeof operation === 'string' ? operation : print(operation),
        ...args,
      },
      integrationContextArgument,
    );
  };

  return { query: test, mutate: test } as ApolloServerTestClient;
};

export function createApolloTestClient(testingModule: TestingModule): ApolloServerTestClient {
  const apolloServer = getApolloServer(testingModule);

  return createApolloTestingClient(apolloServer);
}
