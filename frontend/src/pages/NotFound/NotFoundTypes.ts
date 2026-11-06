export interface NotFoundState {
  /** The URL that didn't match any route. */
  path: string;
}

export type NotFoundActions = Record<string, never>;

export interface NotFoundLogic {
  state: NotFoundState;
  actions: NotFoundActions;
}
