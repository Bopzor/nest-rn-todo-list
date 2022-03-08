import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { ILoginUserDto } from 'todo-shared';

import { useAppDispatch } from '../../reduxAppHooks';
import { LoginScreenProps } from '../../ui/navigation.types';
import { validateLoginInput } from '../../validation/validation';
import { login } from '../authentication';

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ILoginUserDto>({
    defaultValues: {
      username: route.params?.username ?? '',
      password: route.params?.password ?? '',
    },
    mode: 'onSubmit',
    resolver: (values) => dispatch(validateLoginInput(values)),
  });

  const theme = useTheme();

  const onSubmit = ({ username, password }: ILoginUserDto) => {
    dispatch(login({ username, password }));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <TextInput dense onChangeText={onChange} value={value} label="Username" />
                {errors?.username && <Text style={{ color: theme.colors.accent }}>{errors.username.message}</Text>}
              </View>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <TextInput onChangeText={onChange} value={value} secureTextEntry label="password" />
                {errors?.password && <Text style={{ color: theme.colors.accent }}>{errors.password.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.mode}
            onPress={() =>
              navigation.navigate('Signup', { username: getValues().username, password: getValues().password })
            }
          >
            <Text style={{ textDecorationLine: 'underline', textDecorationColor: theme.colors.accent }}>
              Don't have an account? Create one!.
            </Text>
          </TouchableOpacity>

          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Login
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  mode: {
    marginBottom: 20,
  },
});
