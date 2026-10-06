import Dbm from "../../index.js";
import {createElement} from "react";

export {default as Text} from "./Text.js";
export {default as HtmlText} from "./HtmlText.js";
export {default as Link} from "./Link.js";
export {default as OptionalLink} from "./OptionalLink.js";
export {default as NumberDisplay} from "./NumberDisplay.js";
export {default as TranslatedText} from "./TranslatedText.js";
export {default as TranslationGroup} from "./TranslationGroup.js";
export {default as Price} from "./Price.js";
export {default as FormattedDate} from "./FormattedDate.js";

export const text = function(aText) {
    if(typeof(aText) === "string") {
        return aText;
    }
    return createElement(Dbm.react.text.Text, {text: aText});
}

export const htmlText = function(aText, aElementType = "span", aAdditionalProps = {}) {
    if(typeof(aText) === "string") {
        //return createElement(aElementType, {"dangerouslySetInnerHTML": {__html: aText}});
    }
    return createElement(Dbm.react.text.HtmlText, {text: aText, elementType: aElementType, ...aAdditionalProps});
}

export const translatedText = function(aText, aTextId) {
    return createElement(Dbm.react.text.TranslatedText, {text: aText, textId: aTextId});
}

export const blockDataText = function(aFieldName) {
    return createElement(Dbm.react.text.Text, {text: Dbm.react.source.blockData(aFieldName)});
}

export const price = function(aPrice, aLanguage = null) {
    return createElement(Dbm.react.text.Price, {price: aPrice, language: aLanguage});
}

export const month = function(aMonth, aLanguage = null) {
    return createElement(Dbm.react.text.FormattedDate, {date: aMonth, format: {calendar: "iso8601", month: "long"}, language: aLanguage});
}

export const year = function(aMonth, aLanguage = null) {
    return createElement(Dbm.react.text.FormattedDate, {date: aMonth, format: {calendar: "iso8601", year: "numeric"}, language: aLanguage});
}