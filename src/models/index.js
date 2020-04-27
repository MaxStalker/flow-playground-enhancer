import { types, onPatch } from "mobx-state-tree";
import { CommitList, commitList } from "./CommitList";
import { Settings, settings } from "./Settings";
import { MockRouter, router } from "./MockRouter";
import { fileManager, FileManager } from "./FileManager";

const Model = types.model({
  commitList: CommitList,
  settings: Settings,
  router: MockRouter,
  fileManager: FileManager,
});

export const store = Model.create({
  commitList,
  settings,
  router,
  fileManager,
});

// Subscribe to new filenames
onPatch(store, (action) => {
  console.log({action});
  const { path } = action;
  if (path === "/fileManager/filename") {
    commitList.fetchList();
  }

  if (path === "/settings/branchName"){
    commitList.fetchFileList();
  }
});
