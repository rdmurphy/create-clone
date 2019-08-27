// packages
import mri from 'mri';

// local
import { createClone } from '.';

async function main(argv_: string[]) {
  const { _, ...flags } = mri(argv_.slice(2));

  const force = flags.force;

  // we only care about the first command, anything else is whatever
  const [repoPath, dest = process.cwd()] = _;

  await createClone(repoPath, dest, { force });
}

main(process.argv).catch(console.error);
