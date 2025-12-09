import { describe, expect, test, vi } from 'vitest';
import { Program } from '../src/program.js';
import type { Cmd, Model } from '../src/types.js';
import { QuitMsg } from '../src/messages.js';

class NoopModel implements Model {
  init(): Cmd {
    return null;
  }

  update(msg: unknown): [Model, Cmd] {
    if (msg instanceof QuitMsg) {
      return [this, null];
    }
    return [this, null];
  }

  view(): string {
    return 'noop';
  }
}

describe('Program', () => {
  test('run resolves and cleans up on quit', async () => {
    // Stub terminal methods to avoid mutating real stdout
    const restore = stubTerminal();
    const program = new Program(new NoopModel(), { altScreen: false, mouseMode: false });
    const resultPromise = program.run();
    // Simulate external quit
    program.send(new QuitMsg());
    const result = await resultPromise;
    expect(result.model).toBeInstanceOf(NoopModel);
    restore();
  });
});

function stubTerminal() {
  const origWrite = process.stdout.write;
  // @ts-expect-error overriding for test
  process.stdout.write = () => true;
  return () => {
    process.stdout.write = origWrite;
  };
}

