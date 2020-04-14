import { types } from "mobx-state-tree";

export const MockRouter = types
  .model({
    view: types.string,
  })
  .actions((self) => ({
    goTo(newView) {
      self.view = newView;
    },
  }));

export const router = MockRouter.create({
  view: "COMMITS",
});
