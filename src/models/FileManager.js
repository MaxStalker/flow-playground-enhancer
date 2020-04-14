import { types } from "mobx-state-tree";

export const FileManager = types
  .model({
    branch: types.string,
    fileName: types.string
  })
  .actions(self => ({
    afterCreate() {
      self.branch = location.pathname.slice(1, -1);
    },
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

      self.fileName = `${prefix}-0${strIndex}.cdc`;
    }
  }))
  .views(self => ({
    get withName() {
      return self.branch.length > 0;
    }
  }));

export const fileManager = FileManager.create({
  branch: "",
  fileName: "contract-001.cdc"
});
