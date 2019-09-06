import { Action } from '../Action';
import { Step } from '../Step';
import { ConcreteStep } from './ConcreteStep';

export class SagaBuilder<T> {
    private steps: Step<T>[] = [];
    private lastStep?: ConcreteStep<T> = undefined;
    
    constructor(private stepFactory: (action: Action<T>) => ConcreteStep<T>) {}

    private addStep(newStep: ConcreteStep<T>) {
        this.steps.push(newStep);
        this.lastStep = newStep;
    }

    step(action: Action<T>): SagaBuilder<T> {
        const newStep = this.stepFactory(action);
        this.addStep(newStep);
        return this;
    }

    withCompensation(action: Action<T>): SagaBuilder<T> {
        this.lastStep!.setCompensation(action);
        return this;
    }

    getSteps(): Step<T>[] {
        return [...this.steps];
    }

}