console.log('Listening for events');
chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  /*  chrome.storage.sync.set({ color: "red" }, function() {
    console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });*/
  console.log(message);
  if (message.msg === "get-logo-image") {
    const logoSrc = chrome.runtime.getURL("flow-logo-dark-theme.svg");
    console.log(logoSrc);
    senderResponse({ link: logoSrc, req: "flow-logo-dark-theme" });
  }
});
