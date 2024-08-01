const fetch = require("node-fetch");

const updateGithub = async (utils, state, description) => {
  const commitSha = process.env.COMMIT_REF;
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!commitSha || !repoOwner || !repoName || !githubToken) {
    utils.build.failBuild("Missing necessary environment variables");
    return;
  }

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/statuses/${commitSha}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state,
      description,
      context: "Netlify",
    }),
  });

  if (!response.ok) {
    utils.build.failBuild("Failed to update GitHub commit status");
  }
};

module.exports = {
  onSuccess: async ({ utils, constants }) => {
    constants.IS_LOCAL ?? console.log("Plugin: onSuccess() running");
    const siteName = process.env.SITE_NAME ?? "Your site";

    await updateGithub(
      utils,
      "success",
      `${siteName} was deployed to Netlify successfully`
    );
  },
  onError: async ({ utils, constants }) => {
    constants.IS_LOCAL ?? console.log("Plugin: onError() running");
    const siteName = process.env.SITE_NAME ?? "Your site";

    await updateGithub(
      utils,
      "failure",
      `${siteName} could not be deployed to Netlify`
    );
  },
  onPreBuild: async ({ utils, constants }) => {
    constants.IS_LOCAL ?? console.log("Plugin: onPreBuild() running");
    const siteName = process.env.SITE_NAME ?? "Your site";

    await updateGithub(
      utils,
      "pending",
      `${siteName} is being deployed to Netlify`
    );
  },
};
