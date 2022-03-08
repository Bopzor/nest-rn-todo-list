import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../authentication/screens/LoginScreen';
import { SignupScreen } from '../authentication/screens/SignupScreen';

import { RootStackParamList } from './navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Navigator initialRouteName="Login">
      <Screen
        name="Login"
        options={{
          title: 'Connection',
        }}
        component={LoginScreen}
      />
      <Screen
        name="Signup"
        options={{
          title: 'Connection',
        }}
        component={SignupScreen}
      />
    </Navigator>
  </NavigationContainer>
);
