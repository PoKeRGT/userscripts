// ==UserScript==
// @name         Netflix seamless play
// @namespace    PoKeRGT
// @version      1.1.0
// @description  Skips intro, recaps and jumps to next video automatically
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

  const nextEpisodeButtonXPath = "//button[@data-uia='next-episode-seamless-button-draining']"
  const skipIntroButtonXPath = "//button[@data-uia='player-skip-intro']"
  const skipRecapButtonXPath = "//button[@data-uia='player-skip-recap']"

  log('Script initialized')

  const clickedButtons = new Map()
  const COOLDOWN_MS = 2000

  function getElementByXpath(path, from) {
    return document.evaluate(path, from, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function shouldClickButton(buttonId) {
    const now = Date.now()
    if ((now - (clickedButtons.get(buttonId) || 0)) < COOLDOWN_MS) {
      log('Button', buttonId, 'in cooldown, skipping click')
      return false
    }
    clickedButtons.set(buttonId, now)
    return true
  }

  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const skipIntroButton = getElementByXpath(skipIntroButtonXPath, node)
        const nextEpisodeButton = getElementByXpath(nextEpisodeButtonXPath, node)
        const skipRecapButton = getElementByXpath(skipRecapButtonXPath, node)

        if (skipIntroButton && shouldClickButton('skipIntro')) {
          log('Clicking Skip Intro button')
          skipIntroButton.click()
        }

        if (nextEpisodeButton && shouldClickButton('nextEpisode')) {
          log('Clicking Next Episode button')
          nextEpisodeButton.click()
        }

        if (skipRecapButton && shouldClickButton('skipRecap')) {
          log('Clicking Skip Recap button')
          skipRecapButton.click()
        }
      }
    }
  });

  log('Starting observer...')
  observer.observe(document, { childList: true, subtree: true });
  log('Observer started successfully')
})();