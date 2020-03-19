let btn = document.getElementById("changeColor");

chrome.storage.sync.get("color", function(data) {
  btn.style.backgroundColor = data.color;
  btn.setAttribute("value", data.color);
});

btn.addEventListener("click", function(event) {
  const color = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.backgroundColor = "' + color + '";'
    });
  });
});
