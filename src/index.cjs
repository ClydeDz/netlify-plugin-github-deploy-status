const {
  onNetlifyBuildSuccess,
  onNetlifyBuildError,
  onNetlifyPreBuild,
} = require("./buildEvents.cjs");

module.exports = {
  onSuccess: onNetlifyBuildSuccess,
  onError: onNetlifyBuildError,
  onPreBuild: onNetlifyPreBuild,
};
