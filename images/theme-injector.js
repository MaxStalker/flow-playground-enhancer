console.log(`Don't strain your eyes`);

const watcher = setInterval(()=>{
  const monaco = document.querySelector('.monaco-aria-container');
  if (monaco !== null){
    clearInterval(monaco);
    init();
  }
})

function init(){
  const header = document.querySelector(".css-vmmsdb");
  header.classList.add('header');

  const sidebar = document.querySelector(".css-183nk0v");
  sidebar.classList.add('sidebar');

  const main = document.querySelector(".css-1kgqnk0");
  main.classList.add('main');
}
