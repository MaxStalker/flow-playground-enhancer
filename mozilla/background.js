browser.runtime.onMessage.addListener((message, sender, senderResponse) => {
  if (message.msg === "get-logo-image") {
    const logoSrc = browser.runtime.getURL("flow-logo-dark-theme.svg");
    senderResponse({ link: logoSrc, req: "flow-logo-dark-theme" });
  }

  if (message.msg === "store-theme-selection") {
    const { theme } = message;
    browser.storage.sync.set({ flowTheme: theme });
    senderResponse({});
  }

  if (message.msg === "get-theme") {
    browser.storage.sync.get(["flowTheme"], result => {
      const { flowTheme } = result;
      if (!flowTheme) {
        browser.storage.sync.set({ flowTheme: "light" }, () => {
          senderResponse({ flowTheme: "light" });
        });
      } else {
        senderResponse({ flowTheme: flowTheme });
      }
    });

    // set this to true in order to make message processing async
    return true;
  }
});
