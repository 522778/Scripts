// ==UserScript==
// @name         Seller Wildberries - add custom text info
// @namespace    http://tampermonkey.net/
// @version      v1
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
        const text = "поставка " + element.textContent.split("№")[1];
        return text;
    }

    function getSupplyDate() {
        const elementInfoBlock = document.querySelector("[class*='Dates-block__content']");
        const element = elementInfoBlock.firstElementChild.lastElementChild;
        const text = element.textContent;
        return text;
    }

    function getSupplyDestination() {
        const element = document.querySelector("[class*='warehouse-name'] > *");
        const text = element.textContent;
        return text;
    }

    function getSupplyType() {
        const elementInfoBlock = document.querySelectorAll("[class*='Supply-information'] [class*='Right-block'] > [class*='Info-block']");
        const element = elementInfoBlock[3].lastElementChild;
        const text = element.textContent.toLowerCase();
        return text;
    }

    function getSupplyQuantity() {
        const element = document.querySelector("[class*='Options-table__display-info'] > *");
        const text = element.textContent.split(" ")[0];
        return text;
    }

    function getBarcode() {
        const elementInfoBlock = document.querySelector("[class*='Packed-summary__content']");
        const element = elementInfoBlock.firstElementChild.firstElementChild;
        const text = element.textContent + " арт";
        return text;
    }

    function getCount() {
        const elementInfoBlock = document.querySelector("[class*='Packed-summary__content']");
        const element = elementInfoBlock.lastElementChild.firstElementChild;
        const text = element.textContent + " шт.";
        return text;
    }

    function createCustomText() {
        const elementContainer = document.createElement("container");
        elementContainer.className = 'custom-text-info-block';
        elementContainer.style.justifyContent = 'center';
        elementContainer.style.alignItems = 'center';
        elementContainer.style.textAlign = 'center';
        elementContainer.style.display = 'inline-block';

        const delimiter = " ";
        let text = "";
        text += getFirm() + delimiter;
        text += getSupplyNumber() + delimiter;
        text += getSupplyDestination() + delimiter;
        text += getSupplyDate() + delimiter;
        text += getSupplyQuantity() + delimiter;
        text += getSupplyType() + delimiter;
        text += getBarcode() + delimiter;
        text += getCount();

        const elementText = document.createElement("text");
        elementText.className = 'custom-text-info';
        elementText.innerHTML = text;
        elementText.style.fontSize = '24px';

        const elementButton = document.createElement('button');
        elementButton.className = 'copy-button';
        elementButton.innerText = 'COPY';

        elementButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(text);
        });

        elementContainer.appendChild(elementText);
        elementContainer.appendChild(elementButton);
        return elementContainer;
    }

    function addCustomText() {
        const elementButtonGenerate = document.querySelector("[class*='Options-table__generate'] >  [class*='button']");

        if (elementButtonGenerate !== null) {
            const elementTextAdded = document.querySelector("[class='custom-text-info-block']");

            if (elementTextAdded == null) {
                const elementCustomText = createCustomText();
                elementButtonGenerate.style.display = 'inline-block';
                elementButtonGenerate.insertAdjacentElement('afterend', elementCustomText);
            }
        }
    }

    // Execute every 1 second
    setInterval(addCustomText, 1000);
})();