import React from 'react';
import { Button, Text, View } from 'react-native';

import { useAppDispatch } from '../reduxAppHooks';

import { signup } from './authentication';

export const SignUpView: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text>signUp</Text>
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
    </View>
  );
};
