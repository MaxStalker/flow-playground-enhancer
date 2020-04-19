const log = (...args) => console.log("Flow Theme:", ...args);
log(`Don't strain your eyes`);

const classMap = {
  uiGrid: ".css-yzrjcg",
  uiHeader: ".css-vmmsdb",
  uiMain: ".css-1kgqnk0",
  uiSidebar: ".css-183nk0v",
  uiCodeLog: ".css-169vnk6",
  uiHeaderIcons: ".css-4a84um",
  uiHeaderLogo: ".css-zkfaav",
  uiHeaderTitle: ".css-1dnh3is",
  uiHeaderRightPart: ".css-4cffwv",

  uiResizeIcon: ".css-19ulhrs",
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

function getTheme(callback) {
  chrome.runtime.sendMessage({ msg: "get-theme" }, callback);
}

function setTheme(theme) {
  chrome.runtime.sendMessage({ msg: "store-theme-selection", theme });
}

function injectSwitcher(classMap) {
  const rightPart = document.querySelector(classMap.uiHeaderRightPart);

  const container = document.createElement("div");
  container.classList.add("switch-container");

  const control = document.createElement("div");
  control.classList.add("switch-control");

  const dot = document.createElement("div");
  dot.classList.add("switch-dot");

  const label = document.createElement("div");
  label.textContent = "Dark Mode";
  label.classList.add("switch-label");

  control.appendChild(dot);
  container.appendChild(control);
  container.appendChild(label);

  const dotControl = container.querySelector(".switch-dot");
  const labelControl = container.querySelector(".switch-label");
  rightPart.append(container);

  const root = document.getElementById("root");

  control.addEventListener("click", event => {
    if (
      event.target.classList.contains("switch-control") ||
      event.target.classList.contains("switch-dot")
    ) {
      dotControl.classList.toggle("switch-dot--active");
      labelControl.classList.toggle("switch-label--active");
      root.classList.toggle("with-theme");

      if (root.classList.contains("with-theme")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  });

  chrome.runtime.sendMessage({ msg: "get-theme" }, (data)=> {
    if (data.flowTheme === "dark") {
      root.classList.add("with-theme");
      dotControl.classList.add("switch-dot--active");
      labelControl.classList.add("switch-label--active");
    }
  });

}

let isDown = false
let draggingEnabled = true;
let dragBlock = null;
const drag = (e) => {
  isDown = true;
  if (draggingEnabled){
    offset = [
      dragBlock.offsetLeft - e.clientX,
      dragBlock.offsetTop - e.clientY
    ];
  }
}
const move = (event) => {
  event.preventDefault();
  if (isDown && draggingEnabled) {
    mousePosition = {
      x : event.clientX,
      y : event.clientY

    };
    dragBlock.style.left = (mousePosition.x + offset[0]) + 'px';
    dragBlock.style.top  = (mousePosition.y + offset[1]) + 'px';
  }
}
document.addEventListener('mouseup', function() {
  isDown = false;
}, true);

function upgradeTransactionLog(){
  document.addEventListener('click', (event)=>{
    const parentNode = document.querySelector('.css-jjiyx5 .css-h83z3o');
    if (event.target === parentNode){
      const logBlock = document.querySelector(".css-jjiyx5 .css-1tmkgm0");
      logBlock.classList.toggle("detached");
      draggingEnabled = logBlock.classList.contains("detached")
      if (draggingEnabled){
        dragBlock = logBlock;
        logBlock.addEventListener('mousedown', drag , true);
        document.addEventListener('mousemove', move, true);
      } else {
        dragBlock = null
        logBlock.removeEventListener('mousedown', drag);
        document.removeEventListener('mousemove', move);
      }
    }
  })

}

function elementWatcher(classMap) {
  const {uiResizeIcon} = classMap;
  setInterval(()=>{
    const resizeIcons = document.querySelectorAll(uiResizeIcon);
    Array.from(resizeIcons).forEach(icon =>{
      if (!icon.classList.contains("resize-icon")){
        icon.classList.add("resize-icon");
      }
    })
  }, 1500);
}

function init(themeName, classMap) {
  const {
    uiHeader,
    uiSidebar,
    uiMain,
    uiGrid,
    uiHeaderIcons,
    uiHeaderLogo,
    uiHeaderTitle,
    uiCodeLog,
  } = classMap;

  injectSwitcher(classMap);

  const root = document.getElementById("root");
  // root.classList.add("with-theme");
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

  /*
  const uiCodeLogContainer = document.querySelector(uiCodeLog);
  uiCodeLogContainer.classList.add('code-log-container');

  const [leftLog, rightLog] = document.querySelectorAll(`${uiCodeLog} > div`);
  leftLog.classList.add("resources-log");
  rightLog.classList.add("right-log");
  */

  log("Class names are injected");

  upgradeTransactionLog();
  elementWatcher(classMap);
}
