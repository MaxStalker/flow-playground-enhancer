import { getBranchUrl, getResourceUrl } from "../github";
import { GIT_API } from "../github";

describe("github utilities", () => {
  it("should return master ref", () =>
    expect(getBranchUrl()).toEqual("/refs/heads/master"));

  it("should return master ref", () => {
    const branchName = "feature/githubApi";
    expect(getBranchUrl("feature/githubApi")).toEqual(
      `/refs/heads/${branchName}`
    );
  });

  it("should return master url", () => {
    const userName = "test";
    const token = "token";
    const repoOwner = "testAnotherUser";
    const repoName = "testRepo";
    const url = `https://${GIT_API}${repoOwner}/${repoName}/git`;
    expect(
      getResourceUrl("master", { userName, token }, { repoOwner, repoName })
    ).toEqual(`${url}/refs/heads/master`);
  });

  it("should return SHA commit url", () => {
    const userName = "test";
    const token = "token";
    const repoOwner = "testAnotherUser";
    const repoName = "testRepo";
    const sha = "1234567";
    const url = `https://${GIT_API}${repoOwner}/${repoName}/git`;
    expect(
      getResourceUrl(
        "commitBySha",
        { userName, token },
        { repoOwner, repoName },
        { sha }
      )
    ).toEqual(`${url}/commits/${sha}`);
  });
});
