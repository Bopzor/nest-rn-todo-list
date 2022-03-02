import { AppDispatch, AppSelector, createStore } from '../store';
import { InMemoryAuthenticationAdapter } from './InMemoryAuthenticationAdapter';

class Store {
  store;

  authenticationGateway: InMemoryAuthenticationAdapter;

  constructor() {
    this.authenticationGateway = new InMemoryAuthenticationAdapter();

    this.store = createStore({
      authenticationGateway: this.authenticationGateway,
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
