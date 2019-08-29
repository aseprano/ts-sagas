import { ConcreteStep } from "./ConcreteStep";

describe('ConcreteStep', () => {

    it('executes the onRun function', async () => {
        let runInvoked = false;
        let argumentPassed: number = 0;

        const step = new ConcreteStep<number>((arg) => {
            runInvoked = true;
            argumentPassed = arg;
            return Promise.resolve();
        });

        await step.run(1);
        expect(runInvoked).toEqual(true);
        expect(argumentPassed).toBe(1);
    });

    it('executes the onCompensate function', async () => {
        let compensateInvoked = false;
        let argumentPassed: number = 0;

        const step = new ConcreteStep<number>(
            () => Promise.resolve(),
            (arg) => {
                compensateInvoked = true;
                argumentPassed = arg;
                return Promise.resolve();
            }
        );

        await step.compensate(10);
        expect(compensateInvoked).toEqual(true);
        expect(argumentPassed).toEqual(10);
    });

})