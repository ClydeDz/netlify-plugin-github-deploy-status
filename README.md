# netlify-plugin-github-deploy-status

Netlify plugin that updates GitHub commit status with the latest deployment progress.

## How to use this?

The following environment variables will need to be added to your Netlify environment variables for this plugin to work.

```
GITHUB_TOKEN=<INSERT YOUR TOKEN HERE>
GITHUB_REPO_OWNER=<GITHUB USERNAME>
GITHUB_REPO_NAME=<GITHUB REPOSITORY>
```

Example:

```
GITHUB_TOKEN=github_pat_XXYYXXXX00123456
GITHUB_REPO_OWNER=clydedz
GITHUB_REPO_NAME=netlify-plugin-github-deploy-status
```

Note:

- Ideally, the `GITHUB_REPO_NAME` should be the same repository that your Netlify site is connected with.
- Netlify will automatically populate `COMMIT_REF` with the GitHub commit hash. No action required on this.
- When creating the GitHub token, add the "read and write" permissions for Commit statuses for this token. This token must be associated with the repository given in the `GITHUB_REPO_NAME` environment variable.

## Credits

Developed by [Clyde D'Souza](https://clydedsouza.net/)
