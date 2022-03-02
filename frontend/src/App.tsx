import React from 'react';
import { StyleSheet, View } from 'react-native';

import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';

import { Provider } from 'react-redux';

import { SignUpView } from './authentication/SignUpView';
import { createStore } from './store';

const store = createStore({});

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <SignUpView />
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
