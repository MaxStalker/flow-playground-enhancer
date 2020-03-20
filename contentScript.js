const log = (...args) => console.log("Flow Theme:", ...args);
log(`Don't strain your eyes`);

const classMap = {
  uiHeader: ".css-vmmsdb",
  uiMain: ".css-183nk0v",
  uiSidebar: ".css-1kgqnk0",
  editorBlue: ".mtk6",
  editorCopy: ".mtk1",
  editorClass: ".mtk22"
};

// Wait while page is loaded
setTimeout(()=>{
  const watcher = setInterval(() => {
    const monaco = document.querySelector(".monaco-aria-container");
    if (monaco !== null) {
      clearInterval(watcher);
      init("basic-dark-theme", classMap);
    }
  }, 1000);
},2000);

function init(themeName, classMap) {
  const {
    uiHeader,
    uiSidebar,
    uiMain,
    editorBlue,
    editorCopy,
    editorClass
  } = classMap;

  const root = document.getElementById("root");
  root.classList.add(`root--${themeName}`);

  const header = document.querySelector(uiHeader);
  header.classList.add("header");

  const sidebar = document.querySelector(uiSidebar);
  sidebar.classList.add("sidebar");

  const main = document.querySelector(uiMain);
  main.classList.add("main");

  log("Class names are injected");
}
