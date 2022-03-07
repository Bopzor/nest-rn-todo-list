export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoDto = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateUserDto = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LogUserDto = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: TodoDto;
  deleteTodo: Scalars['String'];
  login: UserDto;
  signup: UserDto;
  toggleTodo: TodoDto;
  updateTodo: TodoDto;
};


export type MutationCreateTodoArgs = {
  todo: CreateTodoDto;
};


export type MutationDeleteTodoArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  user: LogUserDto;
};


export type MutationSignupArgs = {
  user: CreateUserDto;
};


export type MutationToggleTodoArgs = {
  id: Scalars['String'];
};


export type MutationUpdateTodoArgs = {
  id: Scalars['String'];
  todo: UpdateTodoDto;
};

export type Query = {
  __typename?: 'Query';
  todos: Array<TodoDto>;
};

export type TodoDto = {
  __typename?: 'TodoDto';
  checked: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title: Scalars['String'];
};

export type UpdateTodoDto = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UserDto = {
  __typename?: 'UserDto';
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  token: Scalars['String'];
  username: Scalars['String'];
};
