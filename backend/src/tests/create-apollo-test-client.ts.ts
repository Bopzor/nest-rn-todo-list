import { getApolloServer } from '@nestjs/apollo';
import { TestingModule } from '@nestjs/testing';
import * as apolloServerTesting from 'apollo-server-testing';

export function createApolloTestClient(testingModule: TestingModule): apolloServerTesting.ApolloServerTestClient {
  const apolloServer = getApolloServer(testingModule);

  // TODO: resolve this type error
  // @ts-ignore
  return apolloServerTesting.createTestClient(apolloServer);
}
