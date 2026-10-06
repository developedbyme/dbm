import Dbm from "../../index.js";
import React from "react";

export default class Price extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        console.log("Price::render");

        let price = this.getPropValue("price");
        console.log(price);

        let locale = this.getPropValue("language");
        if(!locale) {
            locale = Dbm.repository.getItem("site").currentLanguageCode;
        }
        
        let formattedPrice = Dbm.utils.TranslationFunctions.getLocalePrice(price, locale);

        if(formattedPrice === null || formattedPrice === undefined) {
            return React.createElement("span", {"data-no-text-value": price});
        }

        return formattedPrice;
    }
}