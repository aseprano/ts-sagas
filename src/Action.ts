export type Action<T> = (state: T) => Promise<void>;
