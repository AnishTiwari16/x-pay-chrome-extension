import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const spanPattern = /<blk ipfs:\/\/Qm\w+ blk>/;

const currentURL = window.location.href;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        let render = false;
        const element = node;
        const postId = currentURL.split('status')[1].replace('/', '');
        const spans = element.querySelectorAll('span');
        const timeElements = element.querySelectorAll('time');
        timeElements.forEach((timeElement) => {
          const parentElement = timeElement.parentElement;
          if (parentElement.tagName.toLowerCase() === 'a') {
            const href = parentElement.getAttribute('href');
            const urlFromHref = href.split('status')[1].replace('/', '');
            if (urlFromHref === postId) {
              render = true;
            }
          }
        });
        spans.forEach((span) => {
          if (spanPattern.test(span.textContent || '')) {
            const shadowRoot = span;
            createRoot(shadowRoot).render(<App render={render} />);
          }
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
