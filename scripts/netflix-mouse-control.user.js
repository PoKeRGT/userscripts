// ==UserScript==
// @name         Netflix Mouse Control
// @namespace    PoKeRGT
// @version      1.01
// @description  Volume/Time mouse control for Netflix
// @author       PoKeRGT
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @run-at       document-ready
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// ==/UserScript==

setTimeout(() => {
  const getPlayer = () => {
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
    return null;
  }

  const player = getPlayer();
  // console.log(player);


  const getVideoTag = () => {
    const videos = document.getElementsByTagName('video');
    return (videos && videos.length === 1 ? videos[0] : null);
  }

  let lastExpectedTimeMillis = null;
  const moveToPosition = (timeMillis) => {
    player.seek(timeMillis);
    lastExpectedTimeMillis = timeMillis;
  }

  const limitRange = (minValue, maxValue, n) => {
    return Math.max(minValue, Math.min(maxValue, n));
  }

  document.body.addEventListener('wheel', (event) => {
    var videoTag = getVideoTag();
    const rect = videoTag.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element.
    const y = event.clientY - rect.top; //y position within the element.
    // console.log("Left? : " + x + " ; Top? : " + y + ".");
    const width = videoTag.offsetWidth;
    const height = videoTag.offsetHeight;
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
        moveToPosition(limitRange(0, player.getDuration(), newPosition));
      } else {
        const newPosition = player.getCurrentTime() - 10000.0;
        moveToPosition(limitRange(0, player.getDuration(), newPosition));
      }
    }
    event.preventDefault();
  }, { passive: false });
}, 7000);