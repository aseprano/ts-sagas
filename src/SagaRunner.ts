import { Saga } from "./Saga";

export interface SagaRunner {

    run(saga: Saga<any>): Promise<void>;

}