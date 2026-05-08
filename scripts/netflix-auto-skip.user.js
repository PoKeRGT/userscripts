// ==UserScript==
// @name         Netflix seamless play
// @namespace    PoKeRGT
// @version      1.4.0
// @description  Skips intro, recaps and jumps to next video seamlessly
// @author       PoKeRGT
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;
  const log = (...args) => DEBUG && console.log('[Netflix Auto-Skip]', ...args);

  const SELECTORS = {
    skipIntro: "[data-uia='player-skip-intro']",
    skipRecap: "[data-uia='player-skip-recap']",
    nextEpisode: "[data-uia='next-episode-seamless-button-draining']"
  };

  const clickedButtons = new Map();
  const COOLDOWN_MS = 2000;

  function isReadyToClick(el) {
    return el && el.offsetParent !== null;
  }

  function shouldClickButton(buttonId) {
    const now = Date.now();
    if ((now - (clickedButtons.get(buttonId) || 0)) < COOLDOWN_MS) return false;
    clickedButtons.set(buttonId, now);
    return true;
  }

  function checkAndClickButtons() {
    for (const [id, selector] of Object.entries(SELECTORS)) {
      const button = document.querySelector(selector);

      // Si existe y está renderizado en pantalla
      if (isReadyToClick(button) && shouldClickButton(id)) {
        log(`Clicking: ${id}`);
        button.click();
      }
    }
  }

  log('Script initialized');

  const INTERVAL_MS = 500;
  checkAndClickButtons();
  const intervalId = setInterval(checkAndClickButtons, INTERVAL_MS);

  window.addEventListener('beforeunload', () => clearInterval(intervalId));
})();