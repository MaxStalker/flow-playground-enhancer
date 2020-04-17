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
      // TODO: Check that branch value is not empty,
      //  so we won't fetch list for not saved playground
      // Or we can fetch a list of available branches and if current one
      // is not present there, then we show button to create new branch

      self.isLoaded = false;

      const { repoName, repoOwner, token } = settings;
      const { branch, filename } = fileManager;
      const repo = { repoName, repoOwner };

      const branchData = yield getBranchData(token, repo, branch);

      console.log(branchData);

      if (branchData.status === 404) {
        yield self.initNewBranch();
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
    initNewBranch: flow(function* () {
      // TODO: We made a copy to master, but not new empty branch...
      const { repoName, repoOwner, token } = settings;
      const { branch } = fileManager;
      const repo = { repoName, repoOwner };

      const masterData = yield getBranchData(token, repo);
      const masterSha = masterData.object.sha;

      const ref = `refs/heads/${branch}`;
      const newBranchRef = yield createBranch(token, repo, {
        sha: masterSha,
        ref,
      });

      const newBranchSha = newBranchRef.object.sha;

      // Prepare data for commit
      const [_, uuid] = branch.split("/");
      const message = `Update README.md with link to playground`;
      const content = `This branch stores your commits from 
        [Flow Playground](https://play.onflow.org/${uuid})`;
      const path = "README.md";

      // Commit README.md file here
      const readmeCommit = yield self.commitFile(message, content, path, {
        sha: newBranchSha,
      });

      console.log({ readmeCommit });
      /*


      const readmeNode = yield createCommitNode(token, repo, {
        prevSha: newBranchSha,
        path: "README.md",
        content
      });

      const newCommit = yield createCommit(token, repo, {
        prevSha: newBranchSha,
        commitSha: readmeNode.sha,
        message: `Update README.md with link to playground`,
      });

      console.log({ newCommit });
      */
    }),
    createNew: flow(function* (message, code, callback) {
      /* We can create commit here, so it will be shown in UI
      const newCommit = Commit.create({
        message
      });
      */

      const { branch, filename } = fileManager;
      // Commit new file to repository
      const commit = yield self.commitFile(message, code, filename, { branch });

      const newCommitModel = Commit.create({
        hash: commit.sha,
        date: commit.committer.date,
        message: message, // TODO: get message from response...
        code,
      });

      self.commits = [newCommitModel, ...self.commits];
      callback();
    }),
    commitFile: flow(function* (message, content, path, branchOrSha) {
      // we need to return commit from here
      const notEmptyMessage =
        message.length > 0 ? message : new Date().toISOString();

      const { token, repoName, repoOwner } = settings;
      const repo = {
        repoName,
        repoOwner,
      };

      let lastNodeSha = null;
      if (branchOrSha.branch) {
        const branchData = yield getBranchData(token, repo, branch);
        lastNodeSha = branchData.object.sha;
      } else {
        lastNodeSha = branchOrSha.sha;
      }

      const lastCommit = yield getCommitBySha(token, repo, {
        sha: lastNodeSha,
      });
      const prevSha = lastCommit.sha;

      const newTree = yield createCommitNode(token, repo, {
        prevSha,
        path,
        content,
      });
      const commitSha = newTree.sha;

      const commit = yield createCommit(token, repo, {
        prevSha,
        commitSha,
        message: notEmptyMessage,
      });

      console.log({ newSha: commit.sha });

      if (commit.sha) {
        console.log({ commitSha });

        const result = yield updateRef(token, repo, {
          ref: branch,
          newCommitSha: commit.sha,
        });

        console.log({ result });
      } else {
        console.log("Commit SHA was not found");
      }
      return commit;
    }),
  }));

export const commitList = CommitList.create({
  commits: [],
  isLoaded: false,
});
