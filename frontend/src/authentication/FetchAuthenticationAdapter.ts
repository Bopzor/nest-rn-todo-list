import Constants from 'expo-constants';

import { ILoginUserDto, ISignupUserDto, IUserDto } from 'todo-shared';

import { AuthenticationPort } from './AuthenticationPort';

export class FetchAuthenticationAdapter implements AuthenticationPort {
  async signup(user: ISignupUserDto): Promise<IUserDto> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + '/auth/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      return await result.json();
    } catch (error) {
      throw error;
    }
  }

  async login(user: ILoginUserDto): Promise<IUserDto> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const res = await result.json();

      return res;
    } catch (error) {
      throw error;
    }
  }
}
