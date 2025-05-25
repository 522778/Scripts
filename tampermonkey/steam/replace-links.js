// ==UserScript==
// @name         SteamLinks
// @namespace    http://tampermonkey.net/
// @version      v3
// @description  Replace Steam links
// @author       Dmitrii Alekseev
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/app/*
// @match        https://steamcommunity.com/profiles/*
// @match        https://steamcommunity.com/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var hrefCurrentPage = window.location.href;

// Replace Community Link and Review Link straight to review+most_popular+negative+russian

    var elementLinkCommunityHub = document.querySelector("a[href*='steamcommunity.com/app/']");
    var elementLinkReview = document.querySelector("a[href*='steamcommunity.com/app'][href*='reviews']");
    var hrefAdded = "/negativereviews/?p=1&browsefilter=toprated&filterLanguage=russian";
    var isStoreAppPage = hrefCurrentPage.includes('store.steampowered.com/app');
    var isCommunityAppPage = hrefCurrentPage.includes('steamcommunity.com/app');

    if (isStoreAppPage) {
        elementLinkCommunityHub.href = elementLinkCommunityHub.href + hrefAdded;
    }

    if (isCommunityAppPage) {
        elementLinkReview.href = elementLinkReview.href.replace('/reviews/', hrefAdded);
    }

// Replace Game Link in profile from Community Hub to Store Page

    var elementLinkGame = document.querySelectorAll("a[href*='steamcommunity.com/app/']");
    var hrefCommunity = "steamcommunity.com";
    var hrefStore = "store.steampowered.com";
    var isProfilePage = hrefCurrentPage.includes('steamcommunity.com/profiles') || hrefCurrentPage.includes('steamcommunity.com/id');

    if (isProfilePage) {
        for (let i = 0; i < elementLinkGame.length; i++) {
            elementLinkGame[i].href = elementLinkGame[i].href.replace(hrefCommunity, hrefStore);
        }
    }
})();