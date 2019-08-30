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

    it('can change the compensation action', async () => {
        let compensationRun = false;

        const step = new ConcreteStep<number>(() => Promise.resolve());
        step.setCompensation(() => {
            compensationRun = true;
            return Promise.resolve();
        });

        await step.compensate(1);
        expect(compensationRun).toEqual(true);
    });

})