import { SagaRunner } from "../SagaRunner";
import { Saga } from "../Saga";
import { Action } from "../Action";

export class ConcreteSagaRunner implements SagaRunner {

    private async runActions(actions: Action<any>[], state: any): Promise<void> {
        if (!actions.length) {
            return Promise.resolve();
        }

        const currentAction = actions.shift()!;
        await currentAction.run(state);

        try {
            return await this.runActions(actions, state);
        } catch (error) {
            await currentAction.compensate(state);
            throw error;
        }
    }

    async run(saga: Saga<any>): Promise<void> {
        return this.runActions(saga.getActions(), saga.getState())
            .catch(() => {});
    }

}
