import { flow, types } from "mobx-state-tree";
import { createBranch, getBranchData, getBranchList, getCommitBySha } from "../utils/github";

const BranchRef = types.model({
  name: types.identifier
});

export const Settings = types
  .model("Settings", {
    loadingBranches: types.boolean,
    token: types.optional(types.string, ""),
    repoUrl: types.optional(types.string, ""),
    branches: types.array(types.string),
    branchName: types.string,
    creatingBranch: types.boolean,
    creationMessage: types.string
  })
  .actions(self => ({
    afterCreate() {
      const token = localStorage.getItem("gh-token");
      if (token) {
        self.token = token;
      }

      const repoUrl = localStorage.getItem("gh-repo-url");
      if (repoUrl) {
        self.repoUrl = repoUrl;
      }

      const branchName = localStorage.getItem("gh-branch-name");
      if (branchName) {
        self.branchName = branchName;
      }

      if (token && repoUrl) {
        self.loadBranchNames();
      }
    },
    setToken(token) {
      self.token = token;
      localStorage.setItem("gh-token", token);
    },
    setRepoUrl(url) {
      self.repoUrl = url;
      localStorage.setItem("gh-repo-url", url);
    },
    loadBranchNames: flow(function* () {
      self.loadingBranches = true;
      const { token, repo } = self;
      const branchList = yield getBranchList(token, repo, "playground");
      for (let i = 0; i < branchList.length; i++) {
        const branch = branchList[i];
        const name = branch.ref.split("/")[3];
        self.branches.push(name);
      }

      if (self.branches.length > 0) {
        // In case branch was deleted outside of UI
        const branchExists = self.branches.includes(self.branchName);
        if (self.branchName === "" || !branchExists) {
          self.setBranch(self.branches[0]);
        }
      }

      self.loadingBranches = false;
    }),
    createNewBranch: flow(function* (newBranchName, callback) {
      self.creatingBranch = true;

      const { token, repo } = self;

      self.creationMessage = "Get master branch data";
      const masterData = yield getBranchData(token, repo);
      const masterSha = masterData.object.sha;

      self.creationMessage = "Get last commit";
      const lastCommit = yield getCommitBySha(token, repo, {
        sha: masterSha
      });

      self.creationMessage = "Create new branch from master";
      const ref = `refs/heads/playground/${newBranchName}`;
      const newBranchRef = yield createBranch(token, repo, {
        sha: lastCommit.sha,
        ref
      });

      self.branches.push(newBranchName);
      self.setBranch(newBranchName);

      self.creatingBranch = false;
      self.creationMessage = "";
      callback();
    }),
    setBranch(branchName) {
      self.branchName = branchName;
      localStorage.setItem("gh-branch-name", branchName);
    }
  }))
  .views(self => ({
    get initialized() {
      return self.token.length > 0 && self.repoUrl.length > 0;
    },
    get repo() {
      if (!self.repoUrl) {
        return {
          repoOwner: "",
          repoName: ""
        };
      }
      const [protocol, domain, repoOwner, repoName] = self.repoUrl.split(/\/(?=\w)/);
      return { repoOwner, repoName };
    },
    get repoName() {
      return "";
      // return self.repoUrl ? self.repo.repoName : "";
    },
    get repoOwner() {
      return "";
      //return self.repoUrl ? self.repo.repoOwner : "";
    },
    get branch() {
      return `playground/${self.branchName}`;
    },
    get branchList() {
      // console.log(self.branches);
      return self.branches.map(branchName => {
        return {
          value: branchName,
          label: branchName
        };
      });
    },
    get currentBranch() {
      return {
        value: self.branchName,
        label: self.branchName
      };
    }
  }));

export const settings = Settings.create({
  repoUrl: "",
  token: "",
  branchName: "",
  branches: [],
  loadingBranches: false,
  creatingBranch: false,
  creationMessage: ""
});
