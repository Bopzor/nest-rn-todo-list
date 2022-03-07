import { AppDispatch, AppSelector, createStore } from '../store';

import { InMemoryAuthenticationAdapter } from './InMemoryAuthenticationAdapter';
import { InMemoryTodosAdapter } from './InMemoryTodosAdapter';

class Store {
  store;

  authenticationGateway: InMemoryAuthenticationAdapter;
  todosGateway: InMemoryTodosAdapter;

  constructor() {
    this.authenticationGateway = new InMemoryAuthenticationAdapter();
    this.todosGateway = new InMemoryTodosAdapter();

    this.store = createStore({
      authenticationGateway: this.authenticationGateway,
      todosGateway: this.todosGateway,
    });
  }

  get getState() {
    return this.store.getState;
  }

  get dispatch(): AppDispatch {
    return this.store.dispatch;
  }

  select<Result, Params extends unknown[]>(selector: AppSelector<Result, Params>, ...params: Params) {
    return selector(this.getState(), ...params);
  }
}

export default Store;
