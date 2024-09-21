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

        const spans = element.querySelectorAll('span');

        spans.forEach((span) => {
          if (span.textContent.includes('AGX')) {
            render = true;
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
