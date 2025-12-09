const CURSOR_HOME = '\u001b[H';
const CLEAR_TO_END = '\u001b[0J';

export interface RendererOptions {
  output?: NodeJS.WritableStream;
  fps?: number;
}

export class StandardRenderer {
  private nextFrame: string | null = null;
  private lastFrame = '';
  private ticker: NodeJS.Timeout | null = null;
  private readonly output: NodeJS.WritableStream;
  private readonly frameInterval: number;

  constructor(options: RendererOptions = {}) {
    this.output = options.output ?? process.stdout;
    const fps = Math.min(Math.max(options.fps ?? 60, 1), 120);
    this.frameInterval = Math.round(1000 / fps);
  }

  start(): void {
    if (this.ticker) {
      return;
    }
    this.ticker = setInterval(() => this.flush(), this.frameInterval);
  }

  stop(): void {
    this.flush();
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  write(view: string): void {
    this.nextFrame = view ?? '';
  }

  repaint(): void {
    this.lastFrame = '';
  }

  private flush(): void {
    if (this.nextFrame === null) {
      return;
    }
    const frame = this.nextFrame;
    if (frame === this.lastFrame) {
      return;
    }
    this.lastFrame = frame;
    this.output.write(`${CURSOR_HOME}${frame}${CLEAR_TO_END}`);
  }
}

