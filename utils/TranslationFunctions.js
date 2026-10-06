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

export const getLocalePrice = function(aPrice, aLocale) {
    let formatter = new Intl.NumberFormat(aLocale, {
        style: "currency",
        currency: "XXX",
    });

    return formatter.formatToParts(aPrice).filter(part => part.type !== "currency" && part.type !== "literal").map(part => part.value).join("");
}

export const getLocaleDate = function(aDate, aFormat, aLocale) {
    let formatter = new Intl.DateTimeFormat(aLocale, aFormat);

    return formatter.format(aDate);
}

export const getLocalePriceWithCurrency = function(aPrice, aCurrency, aLocale) {
    let formatter = new Intl.NumberFormat(aLocale, {
        style: "currency",
        currency: aCurrency,
    });

    return formatter.format(aPrice);
}

export const getDateAsTemporal = function(aValue) {
    if(aValue instanceof Date) {
        return Temporal.Instant.fromEpochMilliseconds(aValue.getTime());
    }
    else if(typeof aValue === "number") {
        return Temporal.Instant.fromEpochMilliseconds(aValue);
    }
    else if(typeof aValue === "string") {
        switch (aValue.length) {
            case 4:
                return Temporal.PlainYearMonth.from(aValue + "-01");
            case 7:
                return Temporal.PlainYearMonth.from(aValue);
            case 10:
                return Temporal.PlainDate.from(aValue);
        }

        if (aValue.includes("[")) {
            return Temporal.ZonedDateTime.from(aValue);
        }
        else if(/Z$|[+-]\d{2}:\d{2}$/.test(aValue)) {
            return Temporal.Instant.from(aValue);
        }

        return Temporal.PlainDateTime.from(value);
    }

    return value;
}