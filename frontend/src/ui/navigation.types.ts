import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: {
    mode: 'login' | 'signup';
  };
};

export type AuthenticationScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
