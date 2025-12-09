import {
  ClearScreenMsg,
  DisableMouseMsg,
  EnableMouseAllMotionMsg,
  EnableMouseCellMotionMsg,
  EnterAltScreenMsg,
  ExitAltScreenMsg,
  HideCursorMsg,
  SetWindowTitleMsg,
  ShowCursorMsg,
  WindowSizeMsg
} from './messages.js';
import type { Msg } from './types.js';

export const clearScreen = (): Msg => new ClearScreenMsg();
export const enterAltScreen = (): Msg => new EnterAltScreenMsg();
export const exitAltScreen = (): Msg => new ExitAltScreenMsg();
export const enableMouseCellMotion = (): Msg => new EnableMouseCellMotionMsg();
export const enableMouseAllMotion = (): Msg => new EnableMouseAllMotionMsg();
export const disableMouse = (): Msg => new DisableMouseMsg();
export const showCursor = (): Msg => new ShowCursorMsg();
export const hideCursor = (): Msg => new HideCursorMsg();
export const setWindowTitle = (title: string): Msg => new SetWindowTitleMsg(title);
export const windowSize = (): Msg => new WindowSizeMsg(process.stdout.columns ?? 0, process.stdout.rows ?? 0);

