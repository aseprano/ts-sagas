import { Saga } from "../Saga";
import { Action } from "../Action";

export abstract class AbstractSaga<T> implements Saga<T> {

    constructor(private state: T) {}

    abstract getActions(): Action<T>[];
    
    getState(): T {
        return this.state;
    }

}