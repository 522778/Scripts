// ==UserScript==
// @name         Market Guru - add copy button to SKU
// @namespace    http://tampermonkey.net/
// @version      v1
// @author       Dmitrii Alekseev
// @match        https://my.marketguru.io/wb/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wildberries.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const buttonElementName = 'copy-button-container';

    function addCopyButton() {
        // Get all elements with SKU text
        const elements = document.querySelectorAll("[label='SKU'] > * > [class='text-wrapper']");

        // Process all elements one by one
        elements.forEach((el) => {
            // Get next element after SKU

            var elementNext;

            try {
                elementNext = el.nextElementSibling;
            } catch (error) {
                // Next element does not exist
            }

            // If copy button not created
            if (elementNext == null || elementNext.nodeName.toLowerCase() != buttonElementName) {
                // Get SKU text and create copy button
                const skuValue = el.textContent.trim();
                const copyButton = createCopyButton(skuValue);
                // And fix SKU style
                el.style.display = 'inline-block';
                el.insertAdjacentElement('afterend', copyButton);
            }
        });
    }

    function createCopyButton(textToCopy) {
        const buttonContainer = document.createElement(buttonElementName);
        buttonContainer.className = 'ng-star-inserted';
        buttonContainer.style.fontSize = '16px';
        buttonContainer.style.marginLeft = '6px';
        buttonContainer.style.display = 'inline-block';

        const button = document.createElement('button');
        button.className = 'copy-button';

        const icon = document.createElement('i');
        icon.className = 'mg-icon-copy';

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(textToCopy);
        });

        button.appendChild(icon);
        buttonContainer.appendChild(button);
        return buttonContainer;
    }

    // Execute 'create copy button code' every 1 second
    setInterval(addCopyButton, 1000);
})();