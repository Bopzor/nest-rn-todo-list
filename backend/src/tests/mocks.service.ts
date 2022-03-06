import { fn, Mock } from 'jest-mock';

import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { TodoService } from 'src/todo/service/todo.service';

export class MockAuthenticationService extends AuthenticationService {
  createUser: Mock<ReturnType<AuthenticationService['createUser']>, Parameters<AuthenticationService['createUser']>> =
    fn();
  logUser: Mock<ReturnType<AuthenticationService['logUser']>, Parameters<AuthenticationService['createUser']>> = fn();
}

export class MockTodoService extends TodoService {
  getAllForUser: Mock<ReturnType<TodoService['getAllForUser']>, Parameters<TodoService['getAllForUser']>> = fn();
  createTodoForUser: Mock<ReturnType<TodoService['createTodoForUser']>, Parameters<TodoService['createTodoForUser']>> =
    fn();
  updateTodo: Mock<ReturnType<TodoService['updateTodo']>, Parameters<TodoService['updateTodo']>> = fn();
  toggleTodo: Mock<ReturnType<TodoService['toggleTodo']>, Parameters<TodoService['toggleTodo']>> = fn();
  deleteTodo: Mock<ReturnType<TodoService['deleteTodo']>, Parameters<TodoService['deleteTodo']>> = fn();
}
