import process from 'node:process'
import type { Disposable, SignalAdapter, SignalHandler } from '../types.js'

/**
 * Node.js signal adapter for handling SIGINT, SIGTERM, etc.
 * @public
 */
export class NodeSignalAdapter implements SignalAdapter {
  private readonly interruptHandlers: Set<SignalHandler> = new Set()
  private readonly terminateHandlers: Set<SignalHandler> = new Set()
  private disposed = false

  private readonly handleInterrupt = (): void => {
    for (const handler of this.interruptHandlers) {
      handler()
    }
  }

  private readonly handleTerminate = (): void => {
    for (const handler of this.terminateHandlers) {
      handler()
    }
  }

  onInterrupt(handler: SignalHandler): Disposable {
    if (this.interruptHandlers.size === 0) {
      process.on('SIGINT', this.handleInterrupt)
    }
    this.interruptHandlers.add(handler)

    return {
      dispose: () => {
        this.interruptHandlers.delete(handler)
        if (this.interruptHandlers.size === 0) {
          process.off('SIGINT', this.handleInterrupt)
        }
      },
    }
  }

  onTerminate(handler: SignalHandler): Disposable {
    if (this.terminateHandlers.size === 0) {
      process.on('SIGTERM', this.handleTerminate)
    }
    this.terminateHandlers.add(handler)

    return {
      dispose: () => {
        this.terminateHandlers.delete(handler)
        if (this.terminateHandlers.size === 0) {
          process.off('SIGTERM', this.handleTerminate)
        }
      },
    }
  }

  dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true

    process.off('SIGINT', this.handleInterrupt)
    process.off('SIGTERM', this.handleTerminate)

    this.interruptHandlers.clear()
    this.terminateHandlers.clear()
  }
}
