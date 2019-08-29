export interface Step<State> {

    run(state: State): Promise<void>;

    compensate(state: State): Promise<void>;

}
