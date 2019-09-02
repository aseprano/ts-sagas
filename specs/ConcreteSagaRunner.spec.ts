import { mock, when, instance, verify } from 'ts-mockito';
import { AbstractSaga } from '../src/impl/AbstractSaga';
import { AbstractStep } from '../src/impl/AbstractStep';
import { ConcreteSagaRunner } from '../src/impl/ConcreteSagaRunner';
import { Step } from '../src/Step';

describe('ConcreteSagaRunner', () => {
    const sagaRunner = new ConcreteSagaRunner();
    
    function createSuccessStep<T>(run: () => void = () => {}, compensate: () => void = () => {}): Step<T> {
        const action = mock(AbstractStep);

        when(action.run).thenReturn(() => {
            run();
            return Promise.resolve();
        });

        when(action.compensate).thenReturn(() => {
            compensate();
            return Promise.resolve();
        });

        return action;
    }

    function createErrorStep<T>(compensate: () => void = () => {}): Step<T> {
        const action = mock(AbstractStep);

        when(action.run)
            .thenReturn(() => Promise.reject("A generic error"));

        when(action.compensate)
            .thenReturn(() => {
                compensate();
                return Promise.resolve();
            });

        return action;
    }

    it('runs with success a saga that has no steps', async () => {
        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getSteps).thenReturn(() => []);
        when(fakeSaga.getState()).thenReturn({});

        await sagaRunner.run(instance(fakeSaga));
    });

    it('runs all the steps are run in sequence if no error happens', async () => {
        const callsOrder: number[] = [];

        const action1 = createSuccessStep(() => {
            callsOrder.push(1);
        });

        const action2 = createSuccessStep(() => {
            callsOrder.push(2);
        });

        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getSteps).thenReturn(() => [
            instance(action1),
            instance(action2),
        ]);

        await sagaRunner.run(instance(fakeSaga));
        expect(callsOrder).toEqual([1, 2]);
    });

    it('does not run steps following an error', (done) => {
        const callsOrder: number[] = [];

        const action1 = createSuccessStep(() => {
            callsOrder.push(1);
        });

        const action2 = createSuccessStep(() => {
            callsOrder.push(2);
        });

        const errorAction = createErrorStep();

        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getSteps).thenReturn(() => [
            instance(action1),
            instance(action2),
            instance(errorAction),
        ]);

        sagaRunner.run(instance(fakeSaga))
            .catch(() => {
                verify(errorAction.run).once();
                expect(callsOrder).toEqual([1, 2]);
                done();
            });
    });

    it('compensates all the steps in the reverse order on error', (done) => {
        const compensations: number[] = [];

        const action1 = createSuccessStep(
            () => {},
            () => {
                compensations.push(1);
            }
        );

        const action2 = createSuccessStep(
            () => {},
            () => {
                compensations.push(2)
            }
        );

        const error = createErrorStep();

        const fakeSaga = mock(AbstractSaga);
        
        when(fakeSaga.getSteps).thenReturn(() => [
            instance(action1),
            instance(action2),
            instance(error),
        ]);

        sagaRunner.run(instance(fakeSaga))
            .catch(() => {
                expect(compensations).toEqual([2, 1]);
                verify(error.compensate).never();
                done();
            });
    });

});
