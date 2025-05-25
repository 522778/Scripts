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

    function createCustomText() {
        const delimiter = " # ";
        let text = "";
        text += getFirm() + delimiter;
        text += getSupplyNumber() + delimiter;
        text += getSupplyDate() + delimiter;
        text += getDestination() + delimiter;
        text += getSupplyType() + delimiter;
        text += getQuantity() + delimiter;
        text += getBarcode() + delimiter;
        text += getCount();

        const elementText = document.createElement("custom-text-info");
        elementText.className = 'custom-text-info';
        elementText.innerHTML = text;
        elementText.style.fontSize = '24px';
        elementText.style.justifyContent = 'center';
        elementText.style.alignItems = 'center';
        elementText.style.textAlign = 'center';
        elementText.style.display = 'inline-block';
        return elementText;
    }

    function addCustomText() {
        const elementButtonGenerate = document.querySelector("[class*='Options-table__generate'] >  [class*='button']");

        if (elementButtonGenerate !== null) {
            const elementTextAdded = document.querySelector("[class='custom-text-info']");

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