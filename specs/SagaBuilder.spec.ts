import { SagaBuilder } from '../src/impl/SagaBuilder';
import { ConcreteStep } from "../src/impl/ConcreteStep";
import { Action } from "./Action";
import { mock, when, instance, verify } from "ts-mockito";

describe('SagaBuilder', () => {

    function stepFactory<T>(action: Action<T>) {
        return new ConcreteStep(action);
    }

    it('builds a saga using all the steps', async () => {
        const stepsRun: number[] = [];

        const builder = new SagaBuilder<number>(stepFactory);

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
    
    it('uses the withCompensation method to configure a proper compensation action in the step', () => {
        const fakeStep = mock(ConcreteStep);
        const myCompensationAction: Action<any> = (state) => Promise.resolve();

        const builder = new SagaBuilder<any>(() => instance(fakeStep));

        builder.step(() => Promise.resolve())
            .withCompensation(myCompensationAction);

        verify(fakeStep.setCompensation(myCompensationAction)).once();
    });

});
