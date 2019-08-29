import { Action } from "../Action";

export abstract class AbstractAction<T> implements Action<T> {

    abstract run(state: T): Promise<void>;

    abstract compensate(state: T): Promise<void>;
    
}