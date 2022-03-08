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
import { ISignupUserDto } from 'todo-shared';

import { useAppDispatch } from '../../reduxAppHooks';
import { SignupScreenProps } from '../../ui/navigation.types';
import { validateSignupInput } from '../../validation/validation';
import { signup } from '../authentication';

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ISignupUserDto>({
    defaultValues: {
      username: route.params?.username ?? '',
      password: route.params?.password ?? '',
    },
    mode: 'onBlur',
    resolver: (values) => dispatch(validateSignupInput(values)),
  });

  const theme = useTheme();

  const onSubmit = ({ username, password, firstName, lastName }: ISignupUserDto) => {
    dispatch(
      signup({
        username,
        password,
        firstName,
        lastName,
      }),
    );
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

          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <TextInput dense onChangeText={onChange} value={value} label="First name" />
                {errors?.firstName && <Text style={{ color: theme.colors.accent }}>{errors.firstName.message}</Text>}
              </View>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <TextInput dense onChangeText={onChange} value={value} label="Last name" />
                {errors?.lastName && <Text style={{ color: theme.colors.accent }}>{errors.lastName.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.mode}
            onPress={() =>
              navigation.navigate('Login', { username: getValues().username, password: getValues().password })
            }
          >
            <Text style={{ textDecorationLine: 'underline', textDecorationColor: theme.colors.accent }}>
              Already have an account? Sign in!
            </Text>
          </TouchableOpacity>

          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Create
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
