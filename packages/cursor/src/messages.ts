/**
 * @public
 */
export class InitialBlinkMsg {
  readonly _tag = 'cursor:init-blink'
}

/**
 * @public
 */
export class BlinkMsg {
  readonly _tag = 'cursor:blink'
  constructor(
    public readonly id: number,
    public readonly tag: number,
    public readonly time: Date,
  ) {}
}
