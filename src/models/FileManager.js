import { types } from "mobx-state-tree";

export const FileManager = types
  .model({
    branch: types.string,
    filename: types.string,
    index: types.number
  })
  .actions((self) => ({
    afterCreate() {
      const pathname = location.pathname.slice(1);

      if (pathname.length < 1) {
        const timer = setInterval(() => {
          const branchName = location.pathname.slice(1);
          if (branchName.length > 1) {
            self.setBranch(branchName);
            clearInterval(timer);
          }
        },500);
      } else {
        self.setBranch(pathname);
      }
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

      self.filename = `${prefix}-0${strIndex}.cdc`;
      self.index = index;
    },
    setBranch(newBranch){
      self.branch = `playground/${newBranch}`
    },
    setIndex(newIndex){``
      self.index = newIndex
    }
  }))
  .views((self) => ({
    get withName() {
      return self.branch.length > 0;
    },
  }));

export const fileManager = FileManager.create({
  branch: "",
  filename: "contract-001.cdc",
  index: 0
});
