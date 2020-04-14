import { types, flow } from "mobx-state-tree";
// For each editor we need a list of commits
import { Commit } from "./Commit";
import {
  createCommit,
  createCommitNode,
  getBranchCommits,
  getBranchData,
  getCommitBySha,
  updateRef,
} from "../utils/github";
import { settings } from "./Settings";

// Get mocked data from here
export const CommitList = types
  .model({
    commits: types.array(Commit),
    isLoaded: types.boolean,
  })
  .actions((self) => ({
    fetchList: flow(function* (id) {
      self.isLoaded = false;

      const { repoName, repoOwner, token } = settings;

      const response = yield getBranchCommits(
        token,
        { repoName, repoOwner },
        { filename: "test.cdc" }
      );

      self.commits = response.map(({ sha, commit }) => {
        return Commit.create({
          hash: sha,
          message: commit.message,
          date: commit.committer.date,
        });
      });
      self.isLoaded = true;
    }),

    createNew: flow(function* (branch, message, code) {
      /* We can create commit here, so it will be shown in UI
      const newCommit = Commit.create({
        message
      });
      */

      const { token, repoName, repoOwner } = settings;

      /* Get this from settings */
      const repo = {
        repoName,
        repoOwner,
      };

      const branchData = yield getBranchData(token, repo, branch);
      const lastNodeSha = branchData.object.sha;

      const lastCommit = yield getCommitBySha(token, repo, {
        sha: lastNodeSha,
      });
      const prevSha = lastCommit.sha;

      const newTree = yield createCommitNode(token, repo, {
        prevSha,
        path: "test.cdc",
        content: code,
      });
      const commitSha = newTree.sha;

      const commit = yield createCommit(token, repo, {
        prevSha,
        commitSha,
        message,
      });

      if (commit.sha) {
        const result = yield updateRef(token, repo, {
          newCommitSha: commit.sha,
        });
        console.log({ result });
      } else {
        console.log("Commit SHA was not found");
      }

      const newCommitModel = Commit.create({
        hash: commit.sha,
        date: commit.committer.date,
        message,
        code,
      });

      self.commits = [newCommitModel, ...self.commits];
    }),
  }));

export const commitList = CommitList.create({
  commits: [],
  isLoaded: false,
});
