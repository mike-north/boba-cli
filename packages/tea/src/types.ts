/**
 * Message - any value that triggers an update.
 */
export type Msg = unknown;

export type Effect<M extends Msg = Msg> = M | M[] | null | undefined;
export type EffectFn<M extends Msg = Msg> = () => Effect<M> | Promise<Effect<M>>;

/**
 * Command - an async side effect that eventually yields a message.
 * Use `null` to indicate no-op.
 */
export type Cmd<M extends Msg = Msg> = EffectFn<M> | null;

/**
 * Elm-like model contract.
 */
export interface Model<M extends Msg = Msg> {
  init(): Cmd<M>;
  update(msg: M): [Model<M>, Cmd<M>];
  view(): string;
}

export type ProgramResult<M extends Model> = {
  model: M;
  error?: unknown;
};

