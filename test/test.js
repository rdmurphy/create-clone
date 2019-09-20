// native
const assert = require('assert').strict;
const path = require('path');

// packages
const fs = require('fs-extra');
const dotenv = require('dotenv');
const glob = require('tiny-glob');

// local
const { createClone } = require('../');

dotenv.config();

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

describe('create-clone', function() {
  this.timeout(20000);

  describe('create-clone + github', () => {
    [
      'rdmurphy/create-clone-test',
      'github:rdmurphy/create-clone-test',
      'https://github.com/rdmurphy/create-clone-test',
      'git@github.com:rdmurphy/create-clone-test',
    ].forEach(repo => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          new Map([['index.txt', 'This is only a test.\n']])
        );
      });
    });

    const branch = 'github:rdmurphy/create-clone-test#a-branch';

    it(branch, async () => {
      await createClone(branch, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a test branch.\n']])
      );
    });

    const private = 'github:rdmurphy/create-clone-test-private';

    it(private, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a private test.\n']])
      );
    });
  });

  describe('create-clone + gitlab', () => {
    [
      'gitlab:rdmurphy_/create-clone-test',
      'https://gitlab.com/rdmurphy_/create-clone-test',
      'git@gitlab.com:rdmurphy_/create-clone-test',
    ].forEach(repo => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          new Map([['index.txt', 'This is only a test.\n']])
        );
      });
    });

    const branch = 'gitlab:rdmurphy_/create-clone-test#a-branch';

    it(branch, async () => {
      await createClone(branch, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a test branch.\n']])
      );
    });

    const private = 'gitlab:rdmurphy_/create-clone-test-private';

    it(private, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a private test.\n']])
      );
    });
  });

  describe('create-clone + bitbucket', () => {
    [
      'bitbucket:rdmurphy_/create-clone-test',
      'https://bitbucket.org/rdmurphy_/create-clone-test',
      'git@bitbucket.org:rdmurphy_/create-clone-test',
    ].forEach(repo => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          new Map([['index.txt', 'This is only a test.\n']])
        );
      });
    });

    const branch = 'bitbucket:rdmurphy_/create-clone-test#a-branch';

    it(branch, async () => {
      await createClone(branch, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a test branch.\n']])
      );
    });

    const private = 'bitbucket:rdmurphy_/create-clone-test-private';

    it(private, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a private test.\n']])
      );
    });
  });

  describe('create-clone + gist', () => {
    [
      'gist:rdmurphy/a331aa74143680d709faf3922b15c463',
      'https://gist.github.com/rdmurphy/a331aa74143680d709faf3922b15c463',
      'git@gist.github.com:rdmurphy/a331aa74143680d709faf3922b15c463',
    ].forEach(repo => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          new Map([['index.txt', 'This is only a test.\n']])
        );
      });
    });

    const private = 'gist:rdmurphy/eec1e6c8861c2af2772f156b1b87be74';

    it(`${private} (private)`, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        new Map([['index.txt', 'This is only a private test.\n']])
      );
    });
  });
});
