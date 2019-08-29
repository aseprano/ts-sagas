import { Step } from "../Step";

export abstract class AbstractStep<T> implements Step<T> {

    abstract run(state: T): Promise<void>;

    abstract compensate(state: T): Promise<void>;
    
}