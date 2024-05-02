// ==UserScript==
// @name         YouTube Video Age and Category Filter
// @namespace    PoKeRGT
// @version      1.02
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
  const CATEGORIES_TO_HIDE = GM_getValue('categoriesToHide', ['Music', 'Sports'])
  const NOT_SEEN_BORDER_COLOR = GM_getValue('notSeenBorderColor', '#00FF00');
  const SEEN_BORDER_COLOR = GM_getValue('seenBorderColor', '#FF0000');

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === 'YTD-RICH-ITEM-RENDERER') {
          const videoElement = node.querySelector('#video-title');
          if (videoElement) {
            const progressBar = node.querySelector('#progress')
            if (progressBar) {
              changeElement(progressBar, '#thumbnail', "seen")
            } else {
              const videoUrl = getVideoUrlFromElement(videoElement);
              const videoTitle = videoElement.textContent.trim();
              fetchVideoDetails(videoUrl, videoTitle, node);
            }
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

  function changeElement(element, closest, prop) {
    const parentElement = element.closest(`div${closest}`);
    if (parentElement) {
      switch (prop) {
        case 'opacity':
          parentElement.style.opacity = OPACITY;
          break;
        case 'not_seen':
          parentElement.style.border = `5px solid ${NOT_SEEN_BORDER_COLOR}`;
          parentElement.style.borderRadius = '20px';
          break;
        case 'seen':
          parentElement.style.border = `5px solid ${SEEN_BORDER_COLOR}`;
          parentElement.style.borderRadius = '20px';
          break;
        default:
          break;
      }
    }
  }

  function fetchVideoDetails(videoUrl, videoTitle) {
    if (videoUrl) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: videoUrl,
        fetch: true,
        onload: function (response) {
          let hidden = false;
          const metaTags = response.responseText.match(/<meta [^>]*>/g);
          const dateElement = findDateMetaTag(metaTags);
          const categoryElement = findCategoryMetaTag(metaTags);
          const videoPath = new URL(videoUrl).pathname + new URL(videoUrl).search
          if (categoryElement && categoryElement.content && CATEGORIES_TO_HIDE.includes(categoryElement.content)) {
            hidden = true;
            const videoElement = document.querySelector(`a[href="${videoPath}"]`);
            if (videoElement) {
              changeElement(videoElement, '#content', "opacity")
            }
            console.log(`Video "${videoTitle}" is in the category "${categoryElement.content}"`);
          }
          if (dateElement && dateElement.content && !hidden) {
            const uploadDate = new Date(dateElement.content);
            const today = new Date();
            const diffInDays = Math.ceil((today - uploadDate) / (1000 * 60 * 60 * 24));
            if (diffInDays > MAX_VIDEO_AGE) {
              const videoElement = document.querySelector(`a[href="${videoPath}"]`);
              if (videoElement) {
                changeElement(videoElement, '#content', "opacity")
              }
              console.log(`Video "${videoTitle}" is older than ${MAX_VIDEO_AGE} days (${diffInDays} days).`);
            } else {
              const videoElement = document.querySelector(`a[href="${videoPath}"]`);
              if (videoElement) {
                changeElement(videoElement, '#thumbnail', "not_seen")
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

  function findCategoryMetaTag(metaTags) {
    const categoryTag = metaTags.find(tag => {
      return tag.includes('itemprop="genre"') || tag.includes('itemprop="category"'); // Adjust this based on the actual category meta tag
    });
    if (categoryTag) {
      const contentMatch = categoryTag.match(/content="([^"]+)"/);
      if (contentMatch && contentMatch[1]) {
        return { content: contentMatch[1] };
      }
    }
    return null;
  }
})();
