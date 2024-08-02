// ==UserScript==
// @name         Netflix Volume and Time Mouse Controlled
// @namespace    PoKeRGT
// @version      2.00
// @description  Volume/Time mouse control for Netflix
// @author       PoKeRGT
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @run-at       document-ready
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const getPlayer = () => {
    try {
      const nApi = netflix.appContext.state.playerApp.getAPI();
      const videoPlayer = nApi.videoPlayer;
      if (videoPlayer && videoPlayer.getVideoPlayerBySessionId && videoPlayer.getAllPlayerSessionIds) {
        const allSessionIds = videoPlayer.getAllPlayerSessionIds();
        const watchSessionIds = allSessionIds.filter(sid => sid.startsWith('watch-'));
        if (watchSessionIds.length > 0) {
          return videoPlayer.getVideoPlayerBySessionId(watchSessionIds[0]);
        } else if (allSessionIds.length > 0) {
          return videoPlayer.getVideoPlayerBySessionId(allSessionIds[0]);
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  const getVideoTag = () => {
    const videos = document.getElementsByTagName('video');
    return (videos && videos.length === 1 ? videos[0] : null);
  }

  const moveToPosition = (player, timeMillis) => {
    player.seek(timeMillis);
  }

  const limitRange = (minValue, maxValue, n) => {
    return Math.max(minValue, Math.min(maxValue, n));
  }

  // Set up a mutation observer to watch for url change to detect navigation
  var previousUrl = location.href;
  var observer = new MutationObserver(function (mutations) {
    // If URL changes...
    if (location.href !== previousUrl) {
      previousUrl = location.href;

      console.log(`New URL: ${location.href}`);

      if (location.href.includes('/watch/')) {
        const player = getPlayer();
        const videoTag = getVideoTag();
        const rect = videoTag.getBoundingClientRect();
        const width = videoTag.offsetWidth;
        const height = videoTag.offsetHeight;

        if (player) {
          console.log('Appending mouse control')
          document.body.addEventListener('wheel', (event) => {

            const x = event.clientX - rect.left; //x position within the element.
            const y = event.clientY - rect.top; //y position within the element.
            // console.log("Left? : " + x + " ; Top? : " + y + ".");

            if ((width / 2) > x) {
              // console.log('isLeft');
              if (event.deltaY < 0) {
                const currVolume = player.getVolume();
                player.setVolume(limitRange(0, 1, currVolume + 0.1))
              } else {
                const currVolume = player.getVolume();
                player.setVolume(limitRange(0, 1, currVolume - 0.1))
              }
            } else {
              // console.log('isRight');
              if (event.deltaY < 0) {
                const newPosition = player.getCurrentTime() + 10000.0;
                moveToPosition(player, limitRange(0, player.getDuration(), newPosition));
              } else {
                const newPosition = player.getCurrentTime() - 10000.0;
                moveToPosition(player, limitRange(0, player.getDuration(), newPosition));
              }
            }

            event.preventDefault();
          }, { passive: false });
        } else {
          console.log('No player found!')
        }
      }
    }
  });

  // Mutation observer setup
  const config = { subtree: true, childList: true };
  observer.observe(document, config);
})();