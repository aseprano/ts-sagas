import { SagaRunner } from "../SagaRunner";
import { Saga } from "../Saga";
import { Step } from "../Step";

export class ConcreteSagaRunner implements SagaRunner {

    private async runSteps(actions: Step<any>[], state: any): Promise<void> {
        if (!actions.length) {
            return Promise.resolve();
        }

        const currentAction = actions.shift()!;
        await currentAction.run(state);

        try {
            return await this.runSteps(actions, state);
        } catch (error) {
            await currentAction.compensate(state);
            return Promise.reject(error);
        }
    }

    async run(saga: Saga<any>): Promise<void> {
        return this.runSteps(saga.getSteps(), saga.getState());
    }

}
