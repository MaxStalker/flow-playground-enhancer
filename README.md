## What is this thing?
This is Chrome Extension, that will inject custom theme into your Flow Playground page to enable ``Dark Mode``.
Feel free to contribute 😊

## How to install

- Clone this repository to your computer
- Find "Extensions" under "More Tools -> Extensions" menu option (or simply type `chrome://extensions/` url and hit enter)
- Enable "Develop Mode"
- Press "Load Unpacked" and target "release" repository in folder, where you have cloned this repository
- Refresh the page and enjoy the dark mode

## Customization

You can adjust colors in flow-dark-theme.css file located in `release` folder. Most of the colors are defined as variables, so you only need to change them once

## Known issues and Caveats
 - Due to the nature of generated CSS class names, it's quite possible that extension will stop working properly with next release of Playground.
 - Scrollbars in sidebar area are not styled
