<h1 align="center">
  create-clone
</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/create-clone"><img src="https://badgen.net/npm/v/create-clone" alt="npm"></a>
  <a href="https://unpkg.com/create-clone/dist/index.js"><img src="https://badgen.net/badgesize/gzip/https://unpkg.com/create-clone/dist/index.js" alt="gzip size"></a>
  <a href="https://unpkg.com/create-clone/dist/index.js"><img src="https://badgen.net/badgesize/brotli/https://unpkg.com/create-clone/dist/index.js" alt="brotli size"></a>
  <a href="https://packagephobia.now.sh/result?p=create-clone"><img src="https://badgen.net/packagephobia/install/create-clone" alt="install size"></a>
</p>

`create-clone` is a template repository scaffolding tool that creates copies of git repositories **with support for private repos**. It taps into the compressed tarball of a repository to quickly pull down a copy without all that extra git cruft.

## Key features

- 🎏 Supports GitHub repos, GitHub gists, GitLab and Bitbucket
- 💡 Understands GitHub shorthand (`rdmurphy/my-cool-template`) for referring to repositories
- 🔐 With proper credentials in place **can clone private repositories on GitHub, GitLab and Bitbucket**

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Usage](#usage)
  - [GitHub](#github)
  - [GitLab](#gitlab)
  - [Bitbucket](#bitbucket)
  - [Gist](#gist)
- [Private repos](#private-repos)
  - [GitHub](#github-1)
  - [GitLab](#gitlab-1)
  - [Bitbucket](#bitbucket-1)
- [What makes this different from `degit`?](#what-makes-this-different-from-degit)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

`create-clone` requires at least Node 10 to run.

This library expects to be used in a global context and makes the most sense when installed globally.

```sh
npm install --global create-clone
# or
yarn global add create-clone
```

This also means it works great when paired with `npx`.

```sh
npx create-clone <repository> <dest>
```

**However!** `create-clone`'s unique name gives it another super power &mdash; you can use a special feature of `npm init` and `yarn create`.

```sh
npm init clone <repository> <dest>
# or
yarn create clone <repository> <dest>
```

This is most of the reason this library exists. 😶

## Usage

`create-clone` works any git host URLs that [`hosted-git-info`](https://github.com/npm/hosted-git-info) supports. By default the copy of the repository is output into your **current working directory**. A path to a different directory can be provided as the second parameter and will be created if necessary.

```sh
# The contents of the repository will be copied into the current directory
create-clone user/repository

# The contents of the repository will be copied into provided directory (and created if necessary)
create-clone user/repository my-new-project
```

By default `create-clone` will stop and not touch a target directory that already contains files, but this can be overriden with `--force`.

```sh
# I already have something in the "my-old-project" directory, but I don't care
create-clone user/repository my-old-project --force
```

### GitHub

```sh
# shortcuts only available to GitHub
create-clone user/repository
create-clone user/repository#branch

create-clone github:user/repository
create-clone github:user/repository.git
create-clone github:user/repository#branch
create-clone github:user/repository.git#branch

# github.com and www.github.com are both supported
create-clone https://github.com/user/repository
create-clone https://github.com/user/repository.git
create-clone https://github.com/user/repository#branch
create-clone https://github.com/user/repository.git#branch
create-clone git@github.com:user/repository
create-clone git@github.com:user/repository.git
create-clone git@github.com:user/repository#branch
create-clone git@github.com:user/repository.git#branch
```

### GitLab

```sh
create-clone gitlab:user/repository
create-clone gitlab:user/repository.git
create-clone gitlab:user/repository#branch
create-clone gitlab:user/repository.git#branch

# gitlab.com and www.gitlab.com are both supported
create-clone https://gitlab.com/user/repository
create-clone https://gitlab.com/user/repository.git
create-clone https://gitlab.com/user/repository#branch
create-clone https://gitlab.com/user/repository.git#branch
create-clone git@gitlab.com:user/repository
create-clone git@gitlab.com:user/repository.git
create-clone git@gitlab.com:user/repository#branch
create-clone git@gitlab.com:user/repository.git#branch
```

### Bitbucket

```sh
create-clone bitbucket:user/repository
create-clone bitbucket:user/repository.git
create-clone bitbucket:user/repository#branch
create-clone bitbucket:user/repository.git#branch

# bitbucket.org and www.bitbucket.org are both supported
create-clone https://bitbucket.org/user/repository
create-clone https://bitbucket.org/user/repository.git
create-clone https://bitbucket.org/user/repository#branch
create-clone https://bitbucket.org/user/repository.git#branch
create-clone git@bitbucket.org:user/repository
create-clone git@bitbucket.org:user/repository.git
create-clone git@bitbucket.org:user/repository#branch
create-clone git@bitbucket.org:user/repository.git#branch
```

### Gist

```sh
create-clone gist:user/hash
create-clone gist:user/hash.git
create-clone gist:user/hash#branch
create-clone gist:user/hash.git#branch

create-clone git@gist.github.com:hash.git
create-clone git+https://gist.github.com:hash.git
create-clone git+https://gist.github.com:hash.git
create-clone https://gist.github.com/user/hash
create-clone https://gist.github.com/user/hash.git
create-clone https://gist.github.com/user/hash#branch
create-clone https://gist.github.com/user/hash.git#branch
create-clone git@gist.github.com:user/hash
create-clone git@gist.github.com:user/hash.git
create-clone git@gist.github.com:user/hash#branch
create-clone git@gist.github.com:user/hash.git#branch
```

## Private repos

GitHub, GitLab and Bitbucket all have varying methods for authenticating against their services, so each one needs slightly different permissions and keys.

> Fun fact &mdash; Private GitHub gists are already supported without any additional authentication because they're only "private" as long as no one else has the URL. [This is a documented feature](https://help.github.com/en/articles/creating-gists#about-gists)!

### GitHub

`create-clone` requires a [GitHub personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with read access for repositories and/or gists. Once you have this token, it needs to be available in your environment at `GITHUB_TOKEN`.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export GITHUB_TOKEN=<personal-access-token>
```

`create-clone` will check for this environment variable when attempting to clone a GitHub repository or gist and [include it as an authorization header](https://developer.github.com/v3/#authentication) in the request. `create-clone` will be able to clone any private GitHub repo your account can access.

### GitLab

GitLab also has [personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), but because access to the archive of a private repository is only available [via the GitLab API](https://docs.gitlab.com/ee/api/repositories.html#get-file-archive), your token needs to be [given the scope of `api` access](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#limiting-scopes-of-a-personal-access-token), _not_ `read_repository`. Once you have this token, it needs to be available in your environment at `GITLAB_TOKEN`.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export GITLAB_TOKEN=<personal-access-token>
```

`create-clone` will check for this environment variable when attempting to clone a GitLab repository and [include it as an authorization header](https://docs.gitlab.com/ee/api/README.html#personal-access-tokens) in the request. `create-clone` will be able to clone any private GitLab repo your account can access.

### Bitbucket

This is the funky one. Bitbucket does not have the equivalent of a personal access token, so we need to use what it calls an [app password](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html). The _only_ permission your app password needs is `Repositories -> Read`. However, because we are using what's essentially a single-purpose password, we also need to include your Bitbucket username as part of the request. To accomplish this, we need to set up **two** environmental variables: `BITBUCKET_USER` for your username, and `BITBUCKET_TOKEN` for your app password.

In your `.bashrc`/`.zshrc`/preferred shell config:

```sh
export BITBUCKET_USER=<your-bitbucket-username>
export BITBUCKET_TOKEN=<app-password>
```

`create-clone` will check for this environment variable when attempting to clone a Bitbucket repository and include it as the [user and password](https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication#app-pw) of the request. `create-clone` will be able to clone any private Bitbucket repo your account can access.

## What makes this different from [`degit`](https://github.com/Rich-Harris/degit)?

Honestly? Not a whole lot. This was mostly me wanting to be able to do something cool like `npm init clone <repo>`/`yarn create clone <repo>`.

The most notable difference is `create-clone` **does not** have a caching layer like `degit` does. In practice I've not found that to be a major issue, but it may be a big deal for some folks! `degit` also has a [cool actions framework layered on top](https://github.com/Rich-Harris/degit#actions).

## License

MIT
