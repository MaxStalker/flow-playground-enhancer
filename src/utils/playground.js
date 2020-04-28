export const storeAction = (index, id) => {
  return `javascript: (function(){
    const value = window.monaco
      .editor
      .getModels()
      .find(item => item.uri.path === "${index}")
      .getLinesContent()
      .join("\\n");
    const container = document.getElementById("${id}");
    container.value = value;
  })();`;
};

export const writeAction = (index, id) => {
  return `javascript: (function(){
    const container = document.getElementById("${id}");
    const code = container.value;
  
    const value = window.monaco
      .editor
      .getModels()
      .find(item => item.uri.path === "${index}")
      .setValue(code);
  })();`;
};

export const getCode = () => {
  const { uri } = document.querySelector("#cadenceEditor .monaco-editor").dataset;
  const [_, editorIndex] = uri.split("inmemory://model");
  const copyCode = storeAction(editorIndex, "gh-code-replicator");
  const injector = document.getElementById("gh-copy-code-injector");
  injector.href = copyCode;
  injector.click();
};

export const getBranch = () => {
  return "playground/test-1";
};
