console.log(`Don't strain your eyes`);

const classMap = {
  editorBlue: '.mtk6',
  editorCopy: '.mtk1',
  editorClass: '.mtk22'
}

// Wait while page is loaded
const watcher = setInterval(()=>{
  const monaco = document.querySelector('.monaco-aria-container');
  if (monaco !== null){
    clearInterval(watcher);
    init(classMap);
  }
}, 1000)

function init(classMap){

  const { uiHeader, uiSidebar, uiMain, editorBlue, editorCopy, editorClass } = classMap;

  const root = document.getElementById('root');
  root.classList.add('root--basic-dark-theme');

  const header = document.querySelector(".css-vmmsdb");
  header.classList.add('header');

  const sidebar = document.querySelector(".css-183nk0v");
  sidebar.classList.add('sidebar');

  const main = document.querySelector(".css-1kgqnk0");
  main.classList.add('main');

  console.log('Class names are injected');

}
