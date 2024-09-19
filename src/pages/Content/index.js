// // src/content.js
// import React from 'react';
// import ReactDOM from 'react-dom';

// // Create a simple React component
// const ContentApp = () => {
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         backgroundColor: 'rgba(255,255,255,0.9)',
//         padding: '10px',
//         zIndex: 9999,
//       }}
//     >
//       <h2>Hello from Content Script!</h2>
//       <p>This is rendered by React.</p>
//     </div>
//   );
// };

// // Create a container for the React component
// const appContainer = document.createElement('div');
// appContainer.id = 'react-chrome-extension-content';
// document.body.appendChild(appContainer);

// // Render the React component into the container
// ReactDOM.render(<ContentApp />, appContainer);
import React from 'react';
import { createRoot } from 'react-dom/client';
// import tailwindcssOutput from '../dist/tailwind-output.css?inline';
import App from './App';

// const globalStyleSheet = new CSSStyleSheet();
// globalStyleSheet.replaceSync(tailwindcssOutput);

const spanPattern = /<blk ipfs:\/\/Qm\w+ blk>/;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        const spans = element.querySelectorAll('span');
        spans.forEach((span) => {
          if (spanPattern.test(span.textContent || '')) {
            const shadowRoot = span;
            createRoot(shadowRoot).render(<App />);
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
