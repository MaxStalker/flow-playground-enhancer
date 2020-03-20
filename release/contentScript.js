const log = (...args) => console.log("Flow Theme:", ...args);
log(`Don't strain your eyes`);

const classMap = {
  uiGrid: ".css-rbz3lt",
  uiHeader: ".css-vmmsdb",
  uiMain: ".css-1kgqnk0",
  uiSidebar: ".css-183nk0v",
  uiCodeLog: ".css-169vnk6",
  uiHeaderIcons: ".css-4a84um",
  uiHeaderLogo: ".css-zkfaav",
  uiHeaderTitle: ".css-1dnh3is"
  /*
  editorBlue: ".mtk6",
  editorCopy: ".mtk1",
  editorClass: ".mtk22"
  */
};

const watcher = setInterval(() => {
  const monaco = document.querySelector(".monaco-aria-container");
  if (monaco !== null) {
    clearInterval(watcher);
    init("basic-dark-theme", classMap);
  }
}, 1000);

function init(themeName, classMap) {
  const {
    uiHeader,
    uiSidebar,
    uiMain,
    uiGrid,
    uiHeaderIcons,
    uiHeaderLogo,
    uiHeaderTitle,
    uiCodeLog
  } = classMap;

  const root = document.getElementById("root");
  root.classList.add("with-theme");
  root.classList.add(`${themeName}`);

  const mainGrid = document.querySelector(uiGrid);
  mainGrid.classList.add("main-grid");

  const header = document.querySelector(uiHeader);
  header.classList.add("header");

  const sidebar = document.querySelector(uiSidebar);
  sidebar.classList.add("sidebar");

  const main = document.querySelector(uiMain);
  main.classList.add("main");

  const headerIcons = document.querySelectorAll(uiHeaderIcons);
  headerIcons.forEach(node => {
    node.classList.add("header-icon");
  });

  const logo = document.querySelector(`${uiHeaderLogo} img`);
  chrome.runtime.sendMessage({ msg: "get-logo-image" }, data => {
    logo.src = data.link;
  });

  const title = document.querySelector(uiHeaderTitle);
  title.classList.add("header-title");

  const [leftLog, rightLog] = document.querySelectorAll(`${uiCodeLog} > div`);
  leftLog.classList.add('resources-log');
  rightLog.classList.add('right-log');

  log("Class names are injected");
}
