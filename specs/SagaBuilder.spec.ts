import { SagaBuilder } from '../src/impl/SagaBuilder';

describe('SagaBuilder', () => {

    it('builds a saga using all the steps', async () => {
        const stepsRun: number[] = [];

        const builder = new SagaBuilder<number>();

        builder.step((arg) => {
            return new Promise((resolve) => {
                stepsRun.push(arg);
                resolve();
            });
        }).step((arg) => {
            return new Promise((resolve) => {
                stepsRun.push(arg);
                resolve();
            });
        });

        const steps = builder.getSteps();
        expect(steps.length).toBe(2);

        await steps[0].run(1);
        await steps[1].run(3);

        expect(stepsRun).toEqual([1, 3]);
    });
    
});
