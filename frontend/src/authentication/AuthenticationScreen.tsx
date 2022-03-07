import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button, TextInput } from 'react-native-paper';

import { useAppDispatch } from '../reduxAppHooks';
import { AuthenticationScreenProps } from '../ui/navigation.types';

import { login, signup } from './authentication';

export const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (route.params.mode === 'login') {
      dispatch(login({ username, password }));
    } else {
      dispatch(
        signup({
          username,
          password,
          firstName,
          lastName,
        }),
      );
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput autoComplete style={styles.input} onChangeText={setUsername} value={username} label="Username" />
      <TextInput
        autoComplete={false}
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        label="password"
      />

      {route.params.mode === 'signup' && (
        <View style={styles.inputContainer}>
          <TextInput
            autoComplete
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
            label="First name"
          />
          <TextInput autoComplete style={styles.input} onChangeText={setLastName} value={lastName} label="Last name" />
        </View>
      )}

      <TouchableOpacity
        style={styles.mode}
        onPress={() => navigation.navigate('Auth', { mode: route.params.mode === 'login' ? 'signup' : 'login' })}
      >
        <Text style={styles.modeText}>
          {route.params.mode === 'login' ? 'Create an account.' : 'Already have an account? Sign in!'}
        </Text>
      </TouchableOpacity>

      <Button mode="contained" onPress={handleSubmit}>
        {route.params.mode === 'login' ? 'Login' : 'Create'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 20,
  },
  mode: {
    width: '100%',
    marginBottom: 30,
  },
  modeText: {
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  submit: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
  },
});
