// ==UserScript==
// @name         YouTube Video Age and Category Filter
// @namespace    PoKeRGT
// @version      1.12
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description  Filters old YouTube videos and hides videos in certain categories.
// @author       PoKeRGT
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @connect      www.youtube.com
// @run-at       document-start
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';


  const MAX_VIDEO_AGE = GM_getValue('maxVideoAge', 15);
  const OPACITY = GM_getValue('opacity', 0.25);
  const CATEGORIES_TO_HIDE = GM_getValue('categoriesToHide', ['Music', 'Sports']);
  const NOT_SEEN_BORDER_COLOR = GM_getValue('notSeenBorderColor', '#00FF00');
  const SEEN_BORDER_COLOR = GM_getValue('seenBorderColor', '#FF0000');


  const processedVideos = new WeakSet();

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1 && node.matches('ytd-rich-item-renderer')) {
          handleVideoItem(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  function handleVideoItem(videoItem) {
    if (processedVideos.has(videoItem)) {
      return;
    }
    processedVideos.add(videoItem);

    const thumbnailElement = videoItem.querySelector('yt-thumbnail-view-model');
    if (!thumbnailElement) return;

    const progressBar = videoItem.querySelector('yt-thumbnail-overlay-progress-bar-view-model');
    if (progressBar) {
      changeElementStyle(thumbnailElement, 'seen');
      return;
    }

    const videoLink = videoItem.querySelector('a.yt-lockup-metadata-view-model-wiz__title');
    if (videoLink && videoLink.href) {
      const videoUrl = new URL(videoLink.href, document.baseURI).href;
      const videoTitle = videoLink.textContent.trim() || 'Untitled Video';
      fetchVideoDetails(videoUrl, videoTitle, thumbnailElement);
    }
  }

  function changeElementStyle(element, prop) {
    if (!element) return;
    element.style.transition = 'all 0.3s ease';
    element.style.overflow = 'hidden';

    switch (prop) {
      case 'opacity':
        element.style.opacity = OPACITY;
        break;
      case 'not_seen':
        element.style.border = `4px solid ${NOT_SEEN_BORDER_COLOR}`;
        element.style.boxSizing = 'border-box';
        break;
      case 'seen':
        element.style.border = `4px solid ${SEEN_BORDER_COLOR}`;
        element.style.boxSizing = 'border-box';
        break;
      default:
        break;
    }
  }

  function fetchVideoDetails(videoUrl, videoTitle, elementToChange) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: videoUrl,
      fetch: true,
      onload: function (response) {
        if (response.status < 200 || response.status >= 300) {
          console.error(`Error fetching video details for "${videoTitle}". Status: ${response.status}`);
          return;
        }

        const metaTags = response.responseText.match(/<meta [^>]*>/g) || [];
        let hidden = false;

        const categoryElement = findMetaTagContent(metaTags, ['itemprop="genre"', 'itemprop="category"']);
        if (categoryElement && CATEGORIES_TO_HIDE.includes(categoryElement)) {
          hidden = true;
          changeElementStyle(elementToChange, 'opacity');
        }

        if (!hidden) {
          const dateElement = findMetaTagContent(metaTags, ['itemprop="datePublished"', 'itemprop="uploadDate"']);
          if (dateElement) {
            const uploadDate = new Date(dateElement);
            const today = new Date();
            const diffInDays = Math.ceil((today - uploadDate) / (1000 * 60 * 60 * 24));

            if (diffInDays > MAX_VIDEO_AGE) {
              changeElementStyle(elementToChange, 'opacity');
            } else {
              changeElementStyle(elementToChange, 'not_seen');
            }
          } else {
            changeElementStyle(elementToChange, 'not_seen');
          }
        }
      },
      onerror: function (error) {
        console.error(`Error de red al obtener detalles de "${videoTitle}":`, error);
      }
    });
  }

  function findMetaTagContent(metaTags, properties) {
    for (const prop of properties) {
      const tag = metaTags.find(t => t.includes(prop));
      if (tag) {
        const contentMatch = tag.match(/content="([^"]+)"/);
        if (contentMatch && contentMatch[1]) {
          return contentMatch[1];
        }
      }
    }
    return null;
  }
})();