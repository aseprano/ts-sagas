import { mock, when, instance, verify } from 'ts-mockito';
import { AbstractSaga } from './AbstractSaga';
import { AbstractAction } from './AbstractAction';
import { ConcreteSagaRunner } from './ConcreteSagaRunner';
import { Action } from '../Action';

describe('ConcreteSagaRunner', () => {
    const sagaRunner = new ConcreteSagaRunner();
    
    function createSuccessAction<T>(run: () => void = () => {}, compensate: () => void = () => {}): Action<T> {
        const action = mock(AbstractAction);

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

    function createErrorAction<T>(compensate: () => void = () => {}): Action<T> {
        const action = mock(AbstractAction);
        when(action.run).thenReturn(() => Promise.reject());
        when(action.compensate).thenReturn(() => {
            compensate();
            return Promise.resolve();
        });

        return action;
    }

    it('runs with success a saga that has no actions', async () => {
        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getActions).thenReturn(() => []);
        when(fakeSaga.getState()).thenReturn({});

        await sagaRunner.run(instance(fakeSaga));
    });

    it('runs all the actions are run in sequence if no error happens', async () => {
        const callsOrder: number[] = [];

        const action1 = createSuccessAction(() => {
            callsOrder.push(1);
        });

        const action2 = createSuccessAction(() => {
            callsOrder.push(2);
        });

        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getActions).thenReturn(() => [
            instance(action1),
            instance(action2),
        ]);

        await sagaRunner.run(instance(fakeSaga));
        expect(callsOrder).toEqual([1, 2]);
    });

    it('does not run actions following an error', async () => {
        const callsOrder: number[] = [];

        const action1 = createSuccessAction(() => {
            callsOrder.push(1);
        });

        const action2 = createSuccessAction(() => {
            callsOrder.push(2);
        });

        const errorAction = createErrorAction();

        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getActions).thenReturn(() => [
            instance(action1),
            instance(action2),
            instance(errorAction),
        ]);

        await sagaRunner.run(instance(fakeSaga));
        verify(errorAction.run).once();
        expect(callsOrder).toEqual([1, 2]);
    });

    it('compensates all the actions in the reverse order on error', async () => {
        const compensations: number[] = [];

        const action1 = createSuccessAction(
            () => {},
            () => {
                compensations.push(1);
            }
        );

        const action2 = createSuccessAction(
            () => {},
            () => {
                compensations.push(2)
            }
        );

        const error = createErrorAction();

        const fakeSaga = mock(AbstractSaga);
        when(fakeSaga.getActions).thenReturn(() => [
            instance(action1),
            instance(action2),
            instance(error),
        ]);

        await sagaRunner.run(instance(fakeSaga));
        expect(compensations).toEqual([2, 1]);
        verify(error.compensate).never();
    });

});
