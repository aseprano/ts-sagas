import { Saga } from "../Saga";
import { Step } from "../Step";
import { SagaBuilder } from "./SagaBuilder";

export abstract class AbstractSaga<T> implements Saga<T> {
    private steps?: Step<T>[] = undefined;

    constructor(private state: T) {}

    getSteps(): Step<T>[] {
        if (this.steps === undefined) {
            const builder = new SagaBuilder<T>();
            this.buildSaga(builder);
            this.steps = builder.getSteps();
        }

        return this.steps;
    }
    
    abstract buildSaga(builder: SagaBuilder<T>): void;

    getState(): T {
        return this.state;
    }

}