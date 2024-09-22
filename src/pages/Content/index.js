import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Script from './Script';
let fighterName = '';
let cid = '';
let betAmount = '';
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        let render = false;

        const element = node;
        const spans = element.querySelectorAll('span');
        spans.forEach((span) => {
          if (span.textContent.includes('AGX')) {
            cid = span.textContent.split('AGX')[1].trim();
            render = true;
            const shadowRoot = span;
            createRoot(shadowRoot).render(<App render={render} />);
          }

          if (span.textContent.includes('place bet on')) {
            const parts = span.textContent.split('place bet on');

            if (parts.length > 1) {
              const remainingText = parts[1].trim();
              const nameAndAmount = remainingText.split(' ');

              fighterName = nameAndAmount.slice(0, -2).join(' ');
              betAmount = nameAndAmount[nameAndAmount.length - 2];
            }
          }
          if (span.textContent.includes('Here is your frame')) {
            render = true;

            const scriptDiv = document.createElement('div');
            span.appendChild(scriptDiv);

            createRoot(scriptDiv).render(
              <Script
                fighterName={fighterName}
                cid={cid}
                betAmount={betAmount}
              />
            );
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
