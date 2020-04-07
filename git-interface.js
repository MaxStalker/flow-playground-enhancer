import React from "react";
import { render } from "react-dom";
import GitApp from "./src/GitApp";

function storeAction(activeIndex) {
  return `javascript: (function(){
    const value = window.monaco.editor.getModels()[${activeIndex}].getLinesContent().join("\\n");
    const container = document.getElementById("git-swap-container");
    container.value = value;
    
    console.log('Value is stored in text field');
  })();`;
}
function restoreAction(activeIndex) {
  return `javascript: (function(){
    const container = document.getElementById("git-swap-container");
    const value = container.value;
    window.monaco.editor.getModels()[${activeIndex}].setValue(value);
  })();`;
}
export const initGitInterface = () => {
  const gitContainer = document.createElement("div");
  gitContainer.classList.add('grid-git');
  gitContainer.id = "grid-git";

  const mainGrid = document.querySelector(".main-grid");
  mainGrid.appendChild(gitContainer);

  // Create portal to put in button
  const rightPart = document.getElementById('header-right-part');
  const portalContainer = document.createElement('div');
  portalContainer.id = 'git-portal';
  rightPart.appendChild(portalContainer);

  /*
  const btnCommit = document.createElement("button");
  btnCommit.textContent = "Store Code";

  const btnRestore = document.createElement("button");
  btnRestore.textContent = "Restore Code";

  const btnSubmit = document.createElement("button");
  btnSubmit.id = "flow-btn-submit";
  btnSubmit.innerText = "Submit Code to Git";
  gitContainer.appendChild(btnSubmit);

  btnSubmit.addEventListener("click", () => {
    console.log("Send this thing to git now...");
  });

  const swapContainer = document.createElement("textarea");
  swapContainer.id = "git-swap-container";
  swapContainer.style.display = "none";
  document.body.appendChild(swapContainer);

  gitContainer.appendChild(swapContainer);

  const store = document.createElement("a");
  store.href = storeAction(1);
  store.innerText = "Store value";
  store.id = "flow-link-store";
  gitContainer.appendChild(store);

  const restore = document.createElement("a");
  restore.href = restoreAction(1);
  restore.innerText = "Restore value";
  restore.id = "flow-link-restore";
  gitContainer.appendChild(restore);

  const btnTestGit = document.createElement("button");
  btnTestGit.id = "flow-btn-submit";
  btnTestGit.innerText = "Test link-click";
  gitContainer.appendChild(btnTestGit);

  btnTestGit.addEventListener("click", () => {
    store.click(); //
  });
  */
  render(<GitApp />, gitContainer);
};
