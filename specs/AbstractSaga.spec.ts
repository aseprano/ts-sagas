import { mock, when, instance, anything, spy } from "ts-mockito";
import { AbstractSaga } from "../src/impl/AbstractSaga";
import { SagaBuilder } from "../src/impl/SagaBuilder";

class FakeSaga<T> extends AbstractSaga<T> {

    buildSaga(builder: SagaBuilder<T>) {}

}

describe('AbstractSaga', () => {

    it('invokes the buildSaga() method when getSteps() is called for the first time', () => {
        let buildSagaMethodInvoked = false;

        const saga = new FakeSaga({});
        const spiedSaga = spy(saga);

        when(spiedSaga.buildSaga(anything())).thenCall(() => {
            buildSagaMethodInvoked = true;
        });

        const steps = saga.getSteps();
        expect(steps).toEqual([]);
        expect(buildSagaMethodInvoked).toBe(true);
    });

    it('does not rebuild the saga when getSteps() is invoked more than one time', () => {
        let numberOfInvocations = 0;

        const saga = new FakeSaga({});
        const spiedSaga = spy(saga);

        when(spiedSaga.buildSaga(anything())).thenCall(() => {
            numberOfInvocations++;
        });

        saga.getSteps();
        saga.getSteps();

        expect(numberOfInvocations).toBe(1);
    });

    it('returns the internal state', () => {
        const sagaState = {
            a: 10,
            b: 100
        };

        const saga = new FakeSaga(sagaState);
        expect(saga.getState()).toBe(sagaState);
    });

});
