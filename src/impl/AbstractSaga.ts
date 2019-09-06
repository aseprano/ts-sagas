import { Saga } from "../Saga";
import { Step } from "../Step";
import { SagaBuilder } from "./SagaBuilder";
import { ConcreteStep } from "./ConcreteStep";

export abstract class AbstractSaga<T> implements Saga<T> {
    private steps?: Step<T>[] = undefined;

    constructor(private state: T) {}

    getSteps(): Step<T>[] {
        if (this.steps === undefined) {
            const builder = new SagaBuilder<T>((action) => new ConcreteStep(action));
            this.buildSaga(builder);
            this.steps = builder.getSteps();
        }

        return this.steps;
    }
    
    getState(): T {
        return this.state;
    }
    
    abstract buildSaga(builder: SagaBuilder<T>): void;

}