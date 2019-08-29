import { Action } from "./Action";

export interface Saga<State> {

    getActions(): Action<State>[];

    getState(): State;

}
