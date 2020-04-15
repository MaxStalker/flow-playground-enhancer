import { types, flow, onAction } from "mobx-state-tree";
// For each editor we need a list of commits
import { Commit } from "./Commit";
import {
  createBranch,
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
      const { branch, filename } = fileManager;
      const repo = { repoName, repoOwner };

      const branchData = yield getBranchData(token, repo, branch);

      // TODO: refactor this code to create new branch if it doesn't exist
      if (branchData.status > 220) {
        const masterData = yield getBranchData(token, repo);
        console.log({ masterData });
        const masterSha = masterData.object.sha;
        console.log({ masterSha });

        const emptyNode = yield createCommitNode(token, repo, {
          prevSha: masterSha,
          path: "README.md",
          content: branch,
        });
        console.log({ emptyNode });

        const newCommit = yield createCommit(token, repo, {
          prevSha: emptyNode.sha,
          commitSha: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
          message: `Create empty branch ${branch}`,
        });

        console.log({ newCommit });

        const newBranchData = yield createBranch(token, repo, {
          ref: branch,
          sha: newCommit.sha,
        });
        console.log({ newBranchData });
      }

      const response = yield getBranchCommits(
        token,
        { repoName, repoOwner },
        { filename }
      );

      // TODO: Create branch here

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

      const [branchData] = yield getBranchData(token, repo, branch);
      console.log({ branchData });
      const lastNodeSha = branchData.object.sha;

      const lastCommit = yield getCommitBySha(token, repo, {
        sha: lastNodeSha,
      });
      const prevSha = lastCommit.sha;

      const newTree = yield createCommitNode(token, repo, {
        prevSha,
        path: filename,
        content: code,
      });
      const commitSha = newTree.sha;

      const commit = yield createCommit(token, repo, {
        prevSha,
        commitSha,
        message: notEmptyMessage,
      });

      console.log({ newSha: commit.sha });

      if (commit.sha) {
        console.log({commitSha});

        const result = yield updateRef(token, repo, {
          ref: branch,
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
