import React from 'react';
import { Button, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../reduxAppHooks';

import { login, signup } from './authentication';
import { selectUser } from './authenticationSlice';

export const AuthenticationScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  return (
    <View>
      <Text>{user?.username}</Text>
      <Button
        onPress={() =>
          dispatch(
            signup({
              username: 'azot',
              firstName: 'Azot',
              lastName: 'Tozat',
              password: 'p4ssWord',
            }),
          )
        }
        title="Signup"
      />
      <Button
        onPress={() =>
          dispatch(
            login({
              username: 'azot',
              password: 'p4ssWord',
            }),
          )
        }
        title="Login"
      />
    </View>
  );
};
