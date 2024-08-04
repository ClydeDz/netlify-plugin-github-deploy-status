const fetch = require("node-fetch");

const updateGithub = async (utils, state, messageTemplate) => {
  const commitSha = process.env.COMMIT_REF; // When developing locally, replace this with an actual value
  // "175284bb50b59b62fa2d9ea3ef762636c449e7d1";
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;
  const githubToken = process.env.GITHUB_TOKEN;
  const description = process.env.SITE_NAME
    ? messageTemplate.replace("$SITE_NAME", process.env.SITE_NAME)
    : messageTemplate.replace("$SITE_NAME", "Your site");

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

const onNetlifyBuildSuccess = async ({ utils, constants }) => {
  constants.IS_LOCAL && console.log("Plugin: onSuccess() running");

  await updateGithub(
    utils,
    "success",
    `$SITE_NAME was deployed to Netlify successfully`
  );
};

const onNetlifyBuildError = async ({ utils, constants }) => {
  constants.IS_LOCAL && console.log("Plugin: onError() running");

  await updateGithub(
    utils,
    "failure",
    `$SITE_NAME could not be deployed to Netlify`
  );
};

const onNetlifyPreBuild = async ({ utils, constants }) => {
  constants.IS_LOCAL && console.log("Plugin: onPreBuild() running");

  await updateGithub(
    utils,
    "pending",
    `$SITE_NAME is being deployed to Netlify`
  );
};

module.exports = {
  onNetlifyBuildSuccess,
  onNetlifyBuildError,
  onNetlifyPreBuild,
};
