chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  console.log(message);
  if (message.msg === "get-logo-image") {
    const logoSrc = chrome.runtime.getURL("flow-logo-dark-theme.svg");
    senderResponse({ link: logoSrc, req: "flow-logo-dark-theme" });
  }
});
