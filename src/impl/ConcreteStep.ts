import { AbstractStep } from "../AbstractStep";
import { Action } from "../Action";

export class ConcreteStep<T> extends AbstractStep<T> {

    constructor(
        private onRun: Action<T>,
        private onCompensate: Action<T> = () => Promise.resolve()
    ) {
        super();
    }

    async run(state: T): Promise<void> {
        return this.onRun(state);
    }

    async compensate(state: T): Promise<void> {
        return this.onCompensate(state);
    }

}