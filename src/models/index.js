import { types } from "mobx-state-tree";
import { CommitList, commitList } from "./CommitList";
import { Settings, settings } from "./Settings";
import { MockRouter, router } from "./MockRouter";

const Model = types.model({
  commitList: CommitList,
  settings: Settings,
  router: MockRouter,
});

export const store = Model.create({
  commitList,
  settings,
  router,
});
