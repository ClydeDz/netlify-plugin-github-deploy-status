const {
  onNetlifyBuildSuccess,
  onNetlifyBuildError,
  onNetlifyPreBuild,
} = require("./buildEvents.cjs");
const fetch = require("node-fetch");

jest.mock("node-fetch");

const consoleLogSpy = jest
  .spyOn(global.console, "log")
  .mockImplementation(jest.fn());

describe("buildEvents", () => {
  const mockUtils = {
    build: {
      failBuild: jest.fn(),
    },
  };

  const mockConstants = {
    IS_LOCAL: true,
  };

  beforeEach(() => {
    process.env.COMMIT_REF = "test-commit-sha";
    process.env.GITHUB_REPO_OWNER = "test-owner";
    process.env.GITHUB_REPO_NAME = "test-repo";
    process.env.GITHUB_TOKEN = "test-token";
    process.env.SITE_NAME = "your-awesome-site";
    process.env.BUILD_ID = "1234567890";
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.COMMIT_REF;
    delete process.env.GITHUB_REPO_OWNER;
    delete process.env.GITHUB_REPO_NAME;
    delete process.env.GITHUB_TOKEN;
    delete process.env.SITE_NAME;
    delete process.env.BUILD_ID;
  });

  describe("scenarios involving updating GitHub status via API", () => {
    it("should update GitHub status when a build passes", async () => {
      fetch.mockResolvedValue({ ok: true });

      await onNetlifyBuildSuccess({
        utils: mockUtils,
        constants: mockConstants,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/test-owner/test-repo/statuses/test-commit-sha",
        {
          method: "POST",
          headers: {
            Authorization: "token test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "success",
            description:
              "your-awesome-site was deployed to Netlify successfully",
            context: "Netlify Deploy Status Plugin",
            target_url:
              "https://app.netlify.com/sites/your-awesome-site/deploys/1234567890",
          }),
        }
      );

      expect(consoleLogSpy).toHaveBeenCalledWith("Plugin: onSuccess() running");
      expect(mockUtils.build.failBuild).not.toHaveBeenCalled();
    });

    it("should update GitHub status when a build fails", async () => {
      fetch.mockResolvedValue({ ok: true });

      await onNetlifyBuildError({
        utils: mockUtils,
        constants: mockConstants,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/test-owner/test-repo/statuses/test-commit-sha",
        {
          method: "POST",
          headers: {
            Authorization: "token test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "failure",
            description: "your-awesome-site could not be deployed to Netlify",
            context: "Netlify Deploy Status Plugin",
            target_url:
              "https://app.netlify.com/sites/your-awesome-site/deploys/1234567890",
          }),
        }
      );

      expect(consoleLogSpy).toHaveBeenCalledWith("Plugin: onError() running");
      expect(mockUtils.build.failBuild).not.toHaveBeenCalled();
    });

    it("should update GitHub status when a build is starting", async () => {
      fetch.mockResolvedValue({ ok: true });

      await onNetlifyPreBuild({
        utils: mockUtils,
        constants: mockConstants,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/test-owner/test-repo/statuses/test-commit-sha",
        {
          method: "POST",
          headers: {
            Authorization: "token test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "pending",
            description: "your-awesome-site is being deployed to Netlify",
            context: "Netlify Deploy Status Plugin",
            target_url:
              "https://app.netlify.com/sites/your-awesome-site/deploys/1234567890",
          }),
        }
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Plugin: onPreBuild() running"
      );
      expect(mockUtils.build.failBuild).not.toHaveBeenCalled();
    });
  });

  describe("other scenarios", () => {
    it.each([
      {
        methodUnderTest: onNetlifyBuildSuccess,
        methodName: "onNetlifyBuildSuccess",
      },
      {
        methodUnderTest: onNetlifyBuildError,
        methodName: "onNetlifyBuildError",
      },
      {
        methodUnderTest: onNetlifyPreBuild,
        methodName: "onNetlifyPreBuild",
      },
    ])(
      `should not print console log in $methodName when env is not local`,
      async ({ methodUnderTest }) => {
        fetch.mockResolvedValue({ ok: true });

        await methodUnderTest({
          utils: mockUtils,
          constants: {},
        });

        expect(consoleLogSpy).not.toHaveBeenCalled();
        expect(mockUtils.build.failBuild).not.toHaveBeenCalled();
      }
    );
  });

  describe("failure scenarios", () => {
    it("should fail if environment variables are missing", async () => {
      delete process.env.COMMIT_REF;

      await onNetlifyBuildSuccess({
        utils: mockUtils,
        constants: mockConstants,
      });

      expect(mockUtils.build.failBuild).toHaveBeenCalledWith(
        "Missing necessary environment variables"
      );
    });

    it("should fail if GitHub API request fails", async () => {
      fetch.mockResolvedValue({ ok: false });

      await onNetlifyBuildSuccess({
        utils: mockUtils,
        constants: mockConstants,
      });

      expect(mockUtils.build.failBuild).toHaveBeenCalledWith(
        "Failed to update GitHub commit status"
      );
    });
  });
});
