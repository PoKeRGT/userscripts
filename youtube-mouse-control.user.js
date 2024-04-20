// ==UserScript==
// @name         YouTube Volume and Time Controller
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        none
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