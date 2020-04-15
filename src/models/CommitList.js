import { types, flow, onAction } from "mobx-state-tree";
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
import { fileManager, branch } from "./FileManager";

// Get mocked data from here
export const CommitList = types
  .model({
    commits: types.array(Commit),
    isLoaded: types.boolean,
  })
  .actions((self) => ({
    fetchList: flow(function* () {
      self.isLoaded = false;

      const { repoName, repoOwner, token } = settings;
      const { filename } = fileManager;

      const response = yield getBranchCommits(
        token,
        { repoName, repoOwner },
        { filename }
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

    createNew: flow(function* (message, code, callback) {
      /* We can create commit here, so it will be shown in UI
      const newCommit = Commit.create({
        message
      });
      */

      const notEmptyMessage =
        message.length > 0 ? message : new Date().toISOString();

      const { token, repoName, repoOwner } = settings;
      const repo = {
        repoName,
        repoOwner,
      };

      const { branch, filename } = fileManager;
      console.log(branch,filename);
      console.log(repoOwner, repoName, notEmptyMessage, code);

      // TODO: if branch doesn't exist, we need to create one

      const branchData = yield getBranchData(token, repo, branch);
      const lastNodeSha = branchData.object.sha;

      console.log({ lastNodeSha });

      const lastCommit = yield getCommitBySha(token, repo, {
        sha: lastNodeSha,
      });
      const prevSha = lastCommit.sha;
      console.log({ prevSha });

      const newTree = yield createCommitNode(token, repo, {
        prevSha,
        path: filename,
        content: code,
      });
      const commitSha = newTree.sha;
      console.log({ commitSha });

      const commit = yield createCommit(token, repo, {
        prevSha,
        commitSha,
        message: notEmptyMessage,
      });

      console.log({ newSha: commit.sha });

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
        message: notEmptyMessage,
        code,
      });

      self.commits = [newCommitModel, ...self.commits];
      callback();
    }),
  }));

export const commitList = CommitList.create({
  commits: [],
  isLoaded: false,
});
