import { Saga } from "../Saga";
import { Step } from "../Step";

export abstract class AbstractSaga<T> implements Saga<T> {

    constructor(private state: T) {}

    abstract getSteps(): Step<T>[];
    
    getState(): T {
        return this.state;
    }

}