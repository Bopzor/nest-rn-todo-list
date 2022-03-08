import { ILoginUserDto, ISignupUserDto } from 'todo-shared';

import { AppThunkAction } from '../store';

import { NotMatchingPatternError } from './NotMatchingPatternError';
import { TooShortError } from './TooShortError';
import { ValidationInput } from './ValidationInput';

export const validateSignupInput =
  (user: ISignupUserDto): AppThunkAction<ValidationInput<ISignupUserDto>> =>
  () => {
    const isUsernameValid = user.username?.trim().length > 3;
    const isLastNameValid = user.lastName?.trim().length > 1;
    const isFirstNameValid = user.firstName?.trim().length > 1;
    const isPasswordValid = user.password?.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);

    const errors: ValidationInput<ISignupUserDto>['errors'] = {};

    if (!isUsernameValid) {
      errors.username = new TooShortError('Username', 3);
    }

    if (!isLastNameValid) {
      errors.lastName = new TooShortError('Last name', 1);
    }

    if (!isFirstNameValid) {
      errors.firstName = new TooShortError('first name', 1);
    }

    if (!isPasswordValid) {
      errors.password = new NotMatchingPatternError(
        'Password',
        '8 characters with at least 1 uppercase, 1 lowercase, 1 numeric and 1 alpha',
      );
    }

    return {
      values: user,
      errors,
    };
  };

export const validateLoginInput =
  (user: ILoginUserDto): AppThunkAction<ValidationInput<ILoginUserDto>> =>
  () => {
    const isUsernameValid = user.username?.trim().length > 3;
    const isPasswordValid = user.password?.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);

    const errors: ValidationInput<ILoginUserDto>['errors'] = {};

    if (!isUsernameValid) {
      errors.username = new TooShortError('Username', 3);
    }

    if (!isPasswordValid) {
      errors.password = new NotMatchingPatternError(
        'Password',
        '8 characters with at least 1 uppercase, 1 lowercase, 1 numeric and 1 alpha',
      );
    }

    return {
      values: user,
      errors,
    };
  };
