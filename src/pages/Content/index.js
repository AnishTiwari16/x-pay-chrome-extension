import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Script from './Script';
let fighterName = '';
let cid = '';
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
            fighterName = span.textContent.split('place bet on')[1].trim();
          }
          if (span.textContent.includes('Here is your frame')) {
            render = true;

            const scriptDiv = document.createElement('div');
            span.appendChild(scriptDiv);

            createRoot(scriptDiv).render(
              <Script fighterName={fighterName} cid={cid} />
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
