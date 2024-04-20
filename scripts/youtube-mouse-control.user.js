// ==UserScript==
// @name         YouTube Volume and Time Mouse Controlled
// @namespace    PoKeRGT
// @version      1.0
// @icon         https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/youtube.svg
// @description  Control Youtube volume and time using mouse wheel.
// @author       PoKeRGT
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// ==/UserScript==

var videoElement = document.getElementById('movie_player');

function volumeControl(event) {
  if (event.deltaY > 0) { // mouse wheel up
    videoElement.setVolume(videoElement.getVolume() - 5);
  } else { // mouse wheel down
    videoElement.setVolume(videoElement.getVolume() + 5);
  }
  console.log(videoElement.getVolume());
}

function timeControl(event) {
  if (event.deltaY > 0) { // mouse wheel up
    videoElement.seekToStreamTime(videoElement.getCurrentTime() - 5);
  } else { // mouse wheel down
    videoElement.seekToStreamTime(videoElement.getCurrentTime() + 5);
  }
  console.log(videoElement.getCurrentTime());
}

document.addEventListener('mousewheel', function (event) {
  var rect = videoElement.getBoundingClientRect();
  if (event.clientX > rect.left && event.clientX < rect.right &&
    event.clientY > rect.top && event.clientY < rect.bottom) {
    cancelScroll(event);
    if (event.clientX < window.innerWidth / 2) { // left half of the screen
      volumeControl(event);
    }
    else { // right half of the screen
      timeControl(event);
    }
  }
}, { passive: false });

function cancelScroll(event) {
  event.preventDefault();
}