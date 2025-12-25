import process from 'node:process'
import { encodeString } from '../bytes.js'
import type {
  Disposable,
  InputHandler,
  ResizeHandler,
  TerminalAdapter,
  TerminalSize,
} from '../types.js'

/**
 * Node.js terminal adapter using stdin/stdout.
 * @public
 */
export class NodeTerminalAdapter implements TerminalAdapter {
  private rawModeEnabled = false
  private readonly inputHandlers: Set<InputHandler> = new Set()
  private readonly resizeHandlers: Set<ResizeHandler> = new Set()
  private disposed = false

  constructor(
    private readonly input: NodeJS.ReadableStream = process.stdin,
    private readonly output: NodeJS.WritableStream = process.stdout,
  ) {}

  private readonly handleData = (data: Buffer | string): void => {
    const bytes =
      typeof data === 'string' ? encodeString(data) : new Uint8Array(data)
    for (const handler of this.inputHandlers) {
      handler(bytes)
    }
  }

  private readonly handleResize = (): void => {
    const size = this.getSize()
    for (const handler of this.resizeHandlers) {
      handler(size)
    }
  }

  onInput(handler: InputHandler): Disposable {
    if (this.inputHandlers.size === 0) {
      this.input.on('data', this.handleData)
      this.input.resume()
    }
    this.inputHandlers.add(handler)

    return {
      dispose: () => {
        this.inputHandlers.delete(handler)
        if (this.inputHandlers.size === 0) {
          this.input.off('data', this.handleData)
        }
      },
    }
  }

  onResize(handler: ResizeHandler): Disposable {
    if (this.resizeHandlers.size === 0 && this.isWritableStream(this.output)) {
      this.output.on('resize', this.handleResize)
    }
    this.resizeHandlers.add(handler)

    return {
      dispose: () => {
        this.resizeHandlers.delete(handler)
        if (
          this.resizeHandlers.size === 0 &&
          this.isWritableStream(this.output)
        ) {
          this.output.off('resize', this.handleResize)
        }
      },
    }
  }

  write(data: string): void {
    if (data.length === 0) {
      return
    }
    this.output.write(data)
  }

  getSize(): TerminalSize {
    const stream = this.output as { columns?: number; rows?: number }
    return {
      columns: stream.columns ?? 80,
      rows: stream.rows ?? 24,
    }
  }

  enableRawMode(): void {
    const stream = this.input as NodeJS.ReadStream
    if (this.isTTY() && typeof stream.setRawMode === 'function') {
      stream.setRawMode(true)
      stream.resume()
      this.rawModeEnabled = true
    }
  }

  disableRawMode(): void {
    const stream = this.input as NodeJS.ReadStream
    if (this.rawModeEnabled && typeof stream.setRawMode === 'function') {
      stream.setRawMode(false)
      stream.pause()
      this.rawModeEnabled = false
    }
  }

  isTTY(): boolean {
    const stream = this.input as NodeJS.ReadStream
    return typeof stream.isTTY === 'boolean' && stream.isTTY
  }

  dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true

    this.disableRawMode()

    this.input.off('data', this.handleData)
    if (this.isWritableStream(this.output)) {
      this.output.off('resize', this.handleResize)
    }

    this.inputHandlers.clear()
    this.resizeHandlers.clear()
  }

  private isWritableStream(
    stream: NodeJS.WritableStream,
  ): stream is NodeJS.WriteStream {
    return (
      'on' in stream && typeof (stream as NodeJS.WriteStream).on === 'function'
    )
  }
}
