import { types, flow } from "mobx-state-tree";
import { getFileContents } from "../utils/github";
import { settings } from "./Settings";
import { fileManager } from "./FileManager";
import { storeAction, writeAction } from "../utils/playground";

export const Commit = types
  .model({
    message: types.optional(types.string, ""),
    hash: types.optional(types.string, ""),
    date: types.optional(types.string, ""),
    code: types.optional(types.string, ""),
    loading: types.optional(types.boolean, false)
  })
  .actions(self => ({
    getCode: flow(function* () {
      self.loading = true;

      const { token, repo } = settings;
      const { filename } = fileManager;
      const fileData = yield getFileContents(token, repo, { filename, ref: self.hash });

      self.code = atob(fileData.content);
      self.loading = false;
    }),
    fetchAndReplace: flow(function* (callback) {
      if (!self.code) {
        yield self.getCode();
      }
      const replicator = document.getElementById("gh-code-replicator");
      replicator.value = self.code;

      const { uri } = document.querySelector("#cadenceEditor .monaco-editor").dataset;
      const [_, editorIndex] = uri.split("inmemory://model");
      const copyCode = writeAction(editorIndex, "gh-code-replicator");

      const injector = document.getElementById("gh-copy-code-injector");
      injector.href = copyCode;
      injector.click();
    })
  }));
