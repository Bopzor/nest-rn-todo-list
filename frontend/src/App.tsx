import React from 'react';

import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';

import { GraphQLAuthenticationAdapter } from './authentication/GraphQLAuthenticationAdapter';
import { createStore } from './store';
import { GraphQLTodosAdapter } from './todo/GraphQLTodosAdapter';
import { Navigation } from './ui/Navigation';

const apolloClient = new ApolloClient({
  uri: Constants?.manifest?.extra?.GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const store = createStore({
  authenticationGateway: new GraphQLAuthenticationAdapter(apolloClient),
  todosGateway: new GraphQLTodosAdapter(Constants?.manifest?.extra?.GRAPHQL_URL, apolloClient),
});

const App = () => {
  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <PaperProvider>
          <Navigation />
          <StatusBar style="auto" />
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default registerRootComponent(App);
