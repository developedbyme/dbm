import Dbm from "../index.js";

export const getPagesNotTranslatedToLanguage = function(aPages, aLanguage) {
    console.log("getPagesNotTranslatedToLanguage");
    let returnArray = [];

    let currentArray = aPages;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentPage = currentArray[i];
        let translations = Dbm.objectPath(currentPage, "translations.pages");
        let translationForLanguage = Dbm.utils.ArrayFunctions.getItemByIfExists(translations, "language", aLanguage);
        console.log(currentPage, translations, translationForLanguage);
        if(!translationForLanguage) {
            returnArray.push(currentPage);
        }
    }

    return returnArray;
}

export const getPagesInLanguage = function(aPages, aLanguage) {
    return Dbm.utils.ArrayFunctions.filterByField(aPages, "language", aLanguage);
}

export const getPagesByLanguageCode = function(aPages, aLanguageCode) {
    return Dbm.utils.ArrayFunctions.filterByField(aPages, "language.identifier", aLanguageCode);
}

export const getPagesForTranslation = function(aPages, aFromLanguage, aToLanguage) {
    let inLanguage = getPagesInLanguage(aPages, aToLanguage);
    return getPagesNotTranslatedToLanguage(inLanguage, aFromLanguage);
}

export const getMissingTranslations = function(aTranslatedPages, aAvailableLanguages) {
    let returnArray = [];

    let currentArray = aAvailableLanguages;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentLanguage = currentArray[i];
        let exisitingItem = Dbm.utils.ArrayFunctions.getItemByIfExists(aTranslatedPages, "language", currentLanguage);
        if(!exisitingItem) {
            returnArray.push(currentLanguage);
        }
    }

    return returnArray;
}
