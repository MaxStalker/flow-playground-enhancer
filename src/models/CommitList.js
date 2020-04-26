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
  getFileContents,
  updateRef,
} from "../utils/github";
import { settings } from "./Settings";
import { fileManager } from "./FileManager";
import { FileRef } from "./FileRef";

// Get mocked data from here
export const CommitList = types
  .model({
    commits: types.array(Commit),
    loading: types.boolean,
    cadenceFiles: types.array(FileRef),
    firstLoad: types.boolean,
  })
  .actions((self) => ({
    fetchList: flow(function* (optionalName) {
      // TODO: Check that branch value is not empty,
      //  so we won't fetch list for not saved playground
      // Or we can fetch a list of available branches and if current one
      // is not present there, then we show button to create new branch

      self.loading = true;

      const { repoName, repoOwner, token } = settings;
      const { branch, filename } = fileManager;
      const repo = { repoName, repoOwner };

      self.checkFilename(filename);

      const branchData = yield getBranchData(token, repo, branch);

      const fetchFileName = optionalName || filename;

      let branchSha = null;
      if (branchData.status === 404) {
        let newBranchData = yield self.initNewBranch();
        console.log({ newBranchData });
        branchSha = newBranchData.object.sha;
      } else {
        branchSha = branchData.object.sha;
      }

      const response = yield getBranchCommits(
        token,
        { repoName, repoOwner },
        { branchSha: branch, filename: fetchFileName }
      );

      self.commits = response.map(({ sha, commit }) => {
        return Commit.create({
          hash: sha,
          message: commit.message,
          date: commit.committer.date,
        });
      });

      self.loading = false;
    }),
    initNewBranch: flow(function* () {
      // TODO: We made a copy to master, but not new empty branch...
      const { repoName, repoOwner, token } = settings;
      const { branch } = fileManager;
      const repo = { repoName, repoOwner };

      const masterData = yield getBranchData(token, repo);
      const masterSha = masterData.object.sha;

      const lastCommit = yield getCommitBySha(token, repo, {
        sha: masterSha,
      });

      const ref = `refs/heads/${branch}`;
      const newBranchRef = yield createBranch(token, repo, {
        sha: lastCommit.sha,
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
      const readmeCommit = yield self.commitFile(
        message,
        content,
        path,
        branch
      );
    }),
    createNew: flow(function* (message, code, callback) {
      /* We can create commit here, so it will be shown in UI
      const newCommit = Commit.create({
        message
      });
      */

      const { branch, filename } = fileManager;
      // Commit new file to repository
      const commit = yield self.commitFile(message, code, filename, branch);

      const newCommitModel = Commit.create({
        hash: commit.sha,
        date: commit.committer.date,
        message: message, // TODO: get message from response...
        code,
      });

      self.commits = [newCommitModel, ...self.commits];
      callback();
    }),
    commitFile: flow(function* (message, content, path, branch) {
      // we need to return commit from here
      const notEmptyMessage =
        message.length > 0 ? message : new Date().toISOString();

      const { token, repoName, repoOwner } = settings;
      const repo = {
        repoName,
        repoOwner,
      };

      /*
      let lastNodeSha = null;
      if (branchOrSha.branch) {

        lastNodeSha = branchData.object.sha;
      } else {
        lastNodeSha = branchOrSha.sha;
      }
      */
      const branchData = yield getBranchData(token, repo, branch);
      const lastNodeSha = branchData.object.sha;

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
    fetchFileList: flow(function* () {
      const { branch } = fileManager;
      const { repoName, repoOwner, token } = settings;
      const repo = { repoName, repoOwner };

      const branchFiles = yield getFileContents(token, repo, {
        ref: branch,
        filename: "",
      });

      for (let i = 0; i < branchFiles.length; i++) {
        const file = branchFiles[i];
        if (file.name.includes(".cdc")) {
          self.cadenceFiles.push(
            FileRef.create({
              name: file.name,
            })
          );
        }
      }

      if (self.cadenceFiles.length > 0 && self.firstLoad) {
        const fileName = self.cadenceFiles[0].name;
        self.firstLoad = false;
        self.fetchList(fileName);
      }
    }),
    checkFilename: (filename) => {
      if (!self.cadenceFiles.find((item) => item.name === filename)) {
        self.cadenceFiles.push(
          FileRef.create({
            name: filename,
          })
        );
      }
    },
  }))
  .views((self) => ({
    get fileList() {
      return self.cadenceFiles
        .sort((a, b) => {
          return a > b;
        })
        .map((file) => {
          return {
            value: file.name,
            label: file.name,
          };
        });
    },
    get fileListGroups() {
      // TODO: make actual use of colors
      return self.fileList.reduce(
        (acc, item) => {
          const { label } = item;
          if (label.includes("contract")) {
            acc[0].options.push({ ...item, color: "#67ba29" });
          } else if (label.includes("transaction")) {
            acc[1].options.push({ ...item, color: "#1488d7" });
          } else if (label.includes("script")) {
            acc[2].options.push({ ...item, color: "#FF8B00" });
          } else {
            acc[3].options.push({ ...item, color: "#d54fec" });
          }

          return acc;
        },
        [
          {
            label: "Contracts",
            options: [],
          },
          {
            label: "Transactions",
            options: [],
          },
          {
            label: "Scripts",
            options: [],
          },
          {
            label: "Custom",
            options: [],
          },
        ]
      );
    },
    get defaultValue(){
      return {
        value: fileManager.filename,
        label: fileManager.filename,
      }
    }
  }));

export const commitList = CommitList.create({
  commits: [],
  loading: false,
  cadenceFiles: [],
  firstLoad: true,
});
