// ==UserScript==
// @name         YouTube Video Age Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Applies opacity to YouTube videos older than 15 days
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.youtube.com
// ==/UserScript==

(function () {
  'use strict';

  const MAX_VIDEO_AGE = 15;
  const OPACITY = 0.25;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === 'YTD-RICH-ITEM-RENDERER') {
          const videoElement = node.querySelector('#video-title');
          if (videoElement) {
            const videoUrl = getVideoUrlFromElement(videoElement);
            const videoTitle = videoElement.textContent.trim();
            fetchVideoDetails(videoUrl, videoTitle);
          }
        }
      });
    });
  });

  observer.observe(document, { childList: true, subtree: true });

  function getVideoUrlFromElement(videoElement) {
    const anchorElement = videoElement.closest('a');
    if (anchorElement && anchorElement.href) {
      const baseUrl = 'https://www.youtube.com';
      const url = new URL(anchorElement.href, baseUrl);
      return url.href;
    }
    return null;
  }

  function fetchVideoDetails(videoUrl, videoTitle) {
    if (videoUrl) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: videoUrl,
        fetch: true,
        onload: function (response) {
          const metaTags = response.responseText.match(/<meta [^>]*>/g);
          const dateElement = findDateMetaTag(metaTags);
          if (dateElement && dateElement.content) {
            const uploadDate = new Date(dateElement.content);
            const today = new Date();
            const diffInDays = Math.ceil((today - uploadDate) / (1000 * 60 * 60 * 24));
            if (diffInDays > MAX_VIDEO_AGE) {
              const videoElement = document.querySelector(`a[href="${new URL(videoUrl).pathname + new URL(videoUrl).search}"]`);
              if (videoElement) {
                const parentElement = videoElement.closest('#content');
                if (parentElement) {
                  parentElement.style.opacity = OPACITY;
                }
                console.log(`Video "${videoTitle}" is older than ${MAX_VIDEO_AGE} days (${diffInDays} days).`);
              }
            } else {
              const videoElement = document.querySelector(`a[href="${new URL(videoUrl).pathname + new URL(videoUrl).search}"]`);
              if (videoElement) {
                const parentElement = videoElement.closest('#thumbnail');
                if (parentElement) {
                  parentElement.style.border = '2px solid red';
                  parentElement.style.borderRadius = '5px';
                }
              }
              console.log(`Video "${videoTitle}" is ${diffInDays} days old.`);
            }
          } else {
            console.log('No video upload date found.');
          }
        },
        onerror: function (error) {
          console.error('Error fetching video details:', error);
        }
      });
    }
  }

  function findDateMetaTag(metaTags) {
    const dateTag = metaTags.find(tag => {
      return tag.includes('itemprop="datePublished"') || tag.includes('itemprop="dateCreated"') || tag.includes('itemprop="uploadDate"');
    });
    if (dateTag) {
      const contentMatch = dateTag.match(/content="([^"]+)"/);
      if (contentMatch && contentMatch[1]) {
        return { content: contentMatch[1] };
      }
    }
    return null;
  }
})();
