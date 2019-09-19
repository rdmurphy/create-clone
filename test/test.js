// native
const assert = require('assert').strict;
const path = require('path');

// packages
const fs = require('fs-extra');
const glob = require('tiny-glob');

// local
const { createClone } = require('../');

async function compare(dir, expected) {
  const files = await glob('**', { cwd: dir });

  assert.deepStrictEqual(files.sort(), [...expected.keys()].sort());

  const output = await Promise.all(
    files.map(async file => [
      file,
      await fs.readFile(path.join(dir, file), 'utf8'),
    ])
  );

  assert.deepStrictEqual(new Map(output), expected);
}

beforeEach(async () => {
  await fs.remove('.output');
});

after(async () => {
  await fs.remove('.output');
});

describe('create-clone', () => {
  it('should clone a repository from GitHub', async () => {
    await createClone('rdmurphy/create-clone-test', '.output');
    await compare(
      '.output',
      new Map([['index.txt', 'This is only a test.\n']])
    );
  });
});
