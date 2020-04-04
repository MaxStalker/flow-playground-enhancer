## What is this thing?
This is Chrome Extension, that will inject custom CSS and code into your Playground in order to enchance you developer experience. Below you can find a list of supported features:
- 🌑Dark/🌞Light theme switcher, with cross-browser saving of changes 
- Transaction/Script log can be detached and moved around. It also sports bigger font for improved readability
- Resizable sidebar
- No more overlay saying that your screen is too small 😉
- Big JSON resource data (bottom-right corner block) support - now it's properly contained and have scrollbars

Feel free to contribute 😊

## Automatic installation
### Chrome Users
Go to [Flow Playground on Chrome Store](https://chrome.google.com/webstore/detail/flow-playground-enhancer/agjkjdemgkkmgdmeobefbmfiakkgkkdh) and add extension to your browser, press OK on popup and refresh Playground page 

### Firefox Users
Go to [Flow Playground on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/flow-playground-enhancer/) and add extension to your browser

## Manual installation
First, clone this repository to your computer. Then follow instruction based on your browsers

### Chrome Users
- Find "Extensions" under "More Tools -> Extensions" menu option (or simply type `chrome://extensions/` url and hit enter)
- Enable "Develop Mode"
- Press "Load Unpacked" and target **chrome** repository in folder, where you have cloned this repository
- Refresh the page and enjoy the dark mode

### Firefox Users
Open the [about:debugging](about:debugging) page, click "This Firefox" (in newer versions of Firefox), click "Load Temporary Add-on", then select any file in **mozilla** folder

## Customization

You can adjust colors in flow-dark-theme.css file located in `release` folder. Most of the colors are defined as variables, so you only need to change them once

## Known issues and Caveats
 - Due to the nature of generated CSS class names, it's quite possible that extension will stop working properly with next release of Playground.
 - Scrollbars in sidebar area are not styled
 - Code suggestion tooltip and accessibility features are not covered (though might work) 
