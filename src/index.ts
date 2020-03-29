// native
import { promises as fs } from 'fs';
import https from 'https';
import { resolve } from 'path';

// packages
import { extract } from 'tar';
import hostedGitInfo from 'hosted-git-info';
import type { OutgoingHttpHeaders } from 'http';

async function ensureDirIsEmpty(dir: string) {
  try {
    const files = await fs.readdir(dir);

    if (files.length > 0) {
      throw new Error(
        `The output directory already contains files (${resolve(dir)})`
      );
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

function prepareGitLabURL(info: hostedGitInfo) {
  const id = encodeURIComponent(`${info.user}/${info.project}`);
  const sha = info.committish ? `?sha=${info.committish}` : '';

  return `https://gitlab.com/api/v4/projects/${id}/repository/archive.tar.gz${sha}`;
}

function downloadTarball(url: URL, type: string, dest: string) {
  return new Promise((resolve, reject) => {
    const headers = {} as OutgoingHttpHeaders;

    if (type === 'github' && process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    if (type === 'gitlab' && process.env.GITLAB_TOKEN) {
      headers['PRIVATE-TOKEN'] = process.env.GITLAB_TOKEN;
    }

    if (
      type === 'bitbucket' &&
      process.env.BITBUCKET_USER &&
      process.env.BITBUCKET_TOKEN
    ) {
      url.username = process.env.BITBUCKET_USER;
      url.password = process.env.BITBUCKET_TOKEN;
    }

    https
      .get(url, { headers }, (res) => {
        const code = res.statusCode;

        if (!code || code >= 400) {
          return reject({ code, message: res.statusMessage });
        }
        if (code >= 300) {
          return downloadTarball(
            new URL(res.headers.location as string),
            type,
            dest
          )
            .then(resolve)
            .catch(reject);
        }

        const extractor = extract({ cwd: dest, strip: 1 });

        res.pipe(extractor).on('finish', resolve).on('error', reject);
      })
      .on('error', reject);
  });
}

interface CreateCloneOptions {
  force?: boolean;
}

export async function createClone(
  repoPath: string,
  dest: string,
  { force = false }: CreateCloneOptions = {}
) {
  const info = hostedGitInfo.fromUrl(repoPath);
  const type = info.type;

  const urlToTarball =
    type === 'gitlab' ? prepareGitLabURL(info) : info.tarball();

  if (!urlToTarball) {
    throw new Error(
      'Unable to determine where to download the archive for this repository'
    );
  }

  const url = new URL(urlToTarball);

  // make sure the directory exists
  await ensureDir(dest);

  if (!force) {
    // make sure the directory has nothing in it
    await ensureDirIsEmpty(dest);
  }

  // download the repo into the directory
  await downloadTarball(url, type, dest);
}
