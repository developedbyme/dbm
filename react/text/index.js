import Dbm from "../../index.js";
import {createElement} from "react";

export {default as Text} from "./Text.js";
export {default as HtmlText} from "./HtmlText.js";
export {default as Link} from "./Link.js";

export let text = function(aText) {
    if(typeof(aText) === "string") {
        return aText;
    }
    return createElement(Dbm.react.text.Text, {text: aText});
}

export let htmlText = function(aText, aElementType = "span", aAdditionalProps = {}) {
    if(typeof(aText) === "string") {
        //return createElement(aElementType, {"dangerouslySetInnerHTML": {__html: aText}});
    }
    return createElement(Dbm.react.text.HtmlText, {text: aText, elementType: aElementType, ...aAdditionalProps});
}