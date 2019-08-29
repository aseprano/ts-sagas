import { Step } from "./Step";

export interface Saga<State> {

    getSteps(): Step<State>[];

    getState(): State;

}
