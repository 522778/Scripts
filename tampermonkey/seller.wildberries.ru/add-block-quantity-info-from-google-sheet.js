// ==UserScript==
// @name         Seller Wildberries - add block quantity info from google sheet
// @namespace    http://tampermonkey.net/
// @version      v1
// @author       Dmitrii Alekseev
// @match        https://seller.wildberries.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seller.wildberries.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------GET-BLOCKS-QUANTITY-INFO-FROM-GOOGLE-SHEET------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    function getDataGoogleSheet() {
        const sheetId = '2PACX-1vQ8vHNAUDGGBZ_KYej7VcQzV3mSac-HBX9r5SWjTjrmoilpd11cPD6kdiJpYcdnQ4oWfu8qa3OcPYOW';
        const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`;

        fetch(url)
            .then(res => res.text())
            .then(csv => {
                const rows = csv.trim().split('\n');
                console.log(rows);
                return rows;
            })
            .catch(err => console.error('Не получилось подключиться к Google Sheet', err));
    }

    function getQuantityInfo(googleData, expectedCustomerId) {
        // первая строка содержит "БЛОК Короба/Палеты", поэтому начинаем со второй
        for (let i = 1; i < googleData.length; i++) {
            const googleDataFormatted = googleData[i].split(',');
            const customerId = googleDataFormatted[0];
            const boxQuantity = googleDataFormatted[1];
            const palletQuantity = googleDataFormatted[2];

            if (customerId === expectedCustomerId) {
                console.log(palletQuantity);
                return (`Короб: ${boxQuantity} / Паллет: ${palletQuantity}`);
            }
        }

        return ("Кратность не задана");
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
        text += getBlocksQuantity() + delimiter;

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