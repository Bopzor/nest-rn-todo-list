export type ValidationInput<T> = {
  values: T;
  errors: {
    [K in keyof T]?: Error;
  };
};
