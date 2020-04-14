import { types } from "mobx-state-tree";

export const Settings = types
  .model("Settings", {
    token: types.optional(types.string, ""),
    repoOwner: types.optional(types.string, ""),
    repoName: types.optional(types.string, ""),
  })
  .actions((self) => ({
    afterCreate() {
      const token = localStorage.getItem("gh-token");
      if (token) {
        self.token = token;
      }

      const repoOwner = localStorage.getItem("gh-repo-owner");
      if (repoOwner) {
        self.repoOwner = repoOwner;
      }

      const repoName = localStorage.getItem("gh-repo-name");
      if (repoName) {
        self.repoName = repoName;
      }
    },
    setToken(token) {
      self.auth = token;
      localStorage.setItem("gh-token", token);
    },

    setRepoOwner(repoOwner) {
      self.repoOwner = repoOwner;
      localStorage.setItem("gh-repo-owner", repoOwner);
    },
    setRepoName(repoName) {
      self.repoName = repoName;
      localStorage.setItem("gh-repo-name", repoName);
    },
  }))
  .views((self) => ({
    get initialized() {
      return (
        self.token.length > 0 &&
        self.repoOwner.length > 0 &&
        self.repoName.length > 0
      );
    },
  }));

export const settings = Settings.create({
  token: "",
  repo: "",
  initialized: false,
});
