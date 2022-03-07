import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthenticationScreen } from '../authentication/AuthenticationScreen';

import { RootStackParamList } from './navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Navigator>
      <Screen
        name="Auth"
        initialParams={{
          mode: 'login',
        }}
        options={({ route }) => ({
          title: route.params.mode === 'login' ? 'Connection' : 'Create account',
        })}
        component={AuthenticationScreen}
      />
    </Navigator>
  </NavigationContainer>
);
