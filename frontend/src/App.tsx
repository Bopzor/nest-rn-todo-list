import React from 'react';
import { StyleSheet, View } from 'react-native';

import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

import { AuthenticationScreen } from './authentication/AuthenticationScreen';
import { FetchAuthenticationAdapter } from './authentication/FetchAuthenticationAdapter';
import { GraphQLAuthenticationAdapter } from './authentication/GraphQLAuthenticationAdapter';
import { createStore } from './store';

const apolloClient = new ApolloClient({
  uri: Constants?.manifest?.extra?.GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const store = createStore({
  // authenticationGateway: new GraphQLAuthenticationAdapter(apolloClient),
  authenticationGateway: new FetchAuthenticationAdapter(),
});

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <AuthenticationScreen />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default registerRootComponent(App);
