export class QuitMsg {
  readonly _tag = 'quit';
}

export class InterruptMsg {
  readonly _tag = 'interrupt';
}

export class SuspendMsg {
  readonly _tag = 'suspend';
}

export class ResumeMsg {
  readonly _tag = 'resume';
}

export class WindowSizeMsg {
  readonly _tag = 'window-size';
  constructor(public readonly width: number, public readonly height: number) {}
}

export class FocusMsg {
  readonly _tag = 'focus';
}

export class BlurMsg {
  readonly _tag = 'blur';
}

export class ClearScreenMsg {
  readonly _tag = 'clear-screen';
}

export class EnterAltScreenMsg {
  readonly _tag = 'enter-alt-screen';
}

export class ExitAltScreenMsg {
  readonly _tag = 'exit-alt-screen';
}

export class EnableMouseCellMotionMsg {
  readonly _tag = 'enable-mouse-cell-motion';
}

export class EnableMouseAllMotionMsg {
  readonly _tag = 'enable-mouse-all-motion';
}

export class DisableMouseMsg {
  readonly _tag = 'disable-mouse';
}

export class ShowCursorMsg {
  readonly _tag = 'show-cursor';
}

export class HideCursorMsg {
  readonly _tag = 'hide-cursor';
}

export class EnableReportFocusMsg {
  readonly _tag = 'enable-report-focus';
}

export class DisableReportFocusMsg {
  readonly _tag = 'disable-report-focus';
}

export class SetWindowTitleMsg {
  readonly _tag = 'set-window-title';
  constructor(public readonly title: string) {}
}

