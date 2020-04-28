import { types } from "mobx-state-tree";

export const FileManager = types
  .model({
    filename: types.string,
    index: types.number
  })
  .actions(self => ({
    setFilename(tag, index) {
      let strIndex = index > 10 ? index : `0${index}`;

      let prefix = "";
      if (tag.toLowerCase().includes("transaction")) {
        prefix = "transaction";
      }

      if (tag.toLowerCase().includes("accounts")) {
        prefix = "contract";
      }

      if (tag.toLowerCase().includes("script")) {
        prefix = "script";
      }

      self.filename = `${prefix}-0${strIndex}.cdc`;
      self.index = index;
    },
    updateFilename(newFileName) {
      self.filename = newFileName;
    },
    setBranch(newBranch) {
      self.branch = `playground/${newBranch}`;
    },
    setIndex(newIndex) {
      ``;
      self.index = newIndex;
    },
    /*
    loadBranchNames: flow(function* () {
      const { token, repoOwner, repoName } = settings;
      const repo = { repoOwner, repoName };

      const branchNames = yield getFileContents(token, repo, {
        filename: "branches.json"
      });
      const branchesData = JSON.parse(atob(branchNames.content));
      console.log({ branchesData });

      const branchList = yield getBranchList(token, repo, "playground");
      for (let i = 0; i < branchList.length; i++) {
        const branch = branchList[i];
        const branchId = branch.ref.split("/")[3];
        const label = branchesData[branchId] || branchId;
        self.branches.put({ id: branchId, name: label });
      }
    })
     */
  }))
  .views(self => ({
    get withName() {
      return self.branch.length > 0;
    },
  }));

export const fileManager = FileManager.create({
  filename: "contract-001.cdc",
  index: 0
});
