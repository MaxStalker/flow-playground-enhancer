import { types, flow } from "mobx-state-tree";
import { getFileContents } from "../utils/github";
import { settings } from "./Settings";
import { set } from "mobx";

export const Commit = types
  .model({
    message: types.optional(types.string, ""),
    hash: types.optional(types.string, ""),
    date: types.optional(types.string, ""),
    code: types.optional(types.string, ""),
    loading: types.optional(types.boolean, false)
  })
  .actions(self => ({
    getCode: flow(function*() {
      self.loading = true;

      const { token, repoName, repoOwner } = settings;

      const fileData = yield getFileContents(
        token,
        { repoName, repoOwner },
        { filename: "test.cdc", ref: self.hash }
      );

      self.code = atob(fileData.content);
      self.loading = false;
    }),
    fetchAndReplace: flow(function*(callback) {
      if (!self.code) {
        yield self.getCode();
      }
      callback(self.code);
    })
  }));
