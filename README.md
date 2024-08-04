# Netlify Deploy Status Plugin

Netlify plugin that updates GitHub commit status with the latest deployment progress.

[![NPM Version](https://img.shields.io/npm/v/%40clydedsouza%2Fnetlify-plugin-github-deploy-status?label=NPM%20%40clydedsouza%2Fnetlify-plugin-github-deploy-status)
](https://www.npmjs.com/package/@clydedsouza/netlify-plugin-github-deploy-status)

## How to use this?

To use this plugin, first install this npm package in your repository using `npm i "@clydedsouza/netlify-plugin-github-deploy-status" -D` and then use the plugin in your `netlify.toml` file as outlined below.

```toml
[[plugins]]
    package = "@clydedsouza/netlify-plugin-github-deploy-status"
```

Then, the following environment variables will need to be added to your Netlify environment variables for this plugin to work. You can either add them in your `.env` file or directly in the Netlify UI. The `GITHUB_TOKEN` value should be kept private, so add it accordingly.

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
- When creating the GitHub token, add the "read and write" permissions for "Commit statuses" for this token. This token must be associated with the repository given in the `GITHUB_REPO_NAME` environment variable.

Run the Netlify build and deploy process for a commit pushed to the GitHub repository. Then head to the commit in GitHub and you should see the commit status reflected, example screenshot below. Note, commit status will be published when a Netlify build begins, when it succeeds and when it fails.

![image info](https://raw.githubusercontent.com/ClydeDz/netlify-plugin-github-deploy-status/main/docs/demo.png)

## Credits

Developed by [Clyde D'Souza](https://clydedsouza.net/)
