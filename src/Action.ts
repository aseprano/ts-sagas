export interface Action<State> {

    run(state: State): Promise<void>;

    compensate(state: State): Promise<void>;

}
