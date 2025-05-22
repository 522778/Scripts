// ==UserScript==
// @name         WB Partners
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  Various scripts
// @author       Dmitrii Alekseev
// @match        https://seller.wildberries.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seller.wildberries.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //---------------------------------------------------------------------------------
    //-------------------------ADD-PACKAGING-AND-PRINTING-INFO-------------------------
    //---------------------------------------------------------------------------------
    function getFirm() {
        const elementInfoBlock = document.querySelector("[class='Supply-detail-options'] [class*='Detail-descriptions']");
        const element = elementInfoBlock.lastElementChild.lastElementChild;
        const text = element.textContent.split("\"")[1];
        return text;
    }

    function getSupplyNumber() {
        const element = document.querySelector("[class='Supply-detail-options'] [class*='Text']");
        const text = element.textContent.split("№")[1];
        return text;
    }

    function getSupplyDate() {
        const elementInfoBlock = document.querySelector("[class*='Dates-block__content']");
        const element = elementInfoBlock.firstElementChild.lastElementChild;
        const text = element.textContent;
        return text;
    }

    function getDestination() {
        const element = document.querySelector("[class*='warehouse-name'] > *");
        const text = element.textContent;
        return text;
    }

    function getSupplyType() {
        const elementInfoBlock = document.querySelectorAll("[class*='Supply-information'] [class*='Right-block'] > [class*='Info-block']");
        const element = elementInfoBlock[3].lastElementChild;
        const text = element.textContent;
        return text;
    }

    function getQuantity() {
        const element = document.querySelector("[class*='Options-table__display-info'] > *");
        const text = element.textContent;
        return text;
    }

    function getBarcode() {
        const elementInfoBlock = document.querySelector("[class*='Packed-summary__content']");
        const element = elementInfoBlock.firstElementChild.firstElementChild;
        const text = element.textContent;
        return text;
    }

    function getCount() {
        const elementInfoBlock = document.querySelector("[class*='Packed-summary__content']");
        const element = elementInfoBlock.lastElementChild.firstElementChild;
        const text = element.textContent;
        return text;
    }




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

    // Execute every 1 second
    setInterval(addCopyButton, 1000);
})();