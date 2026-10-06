import Dbm from "../../index.js";
import React from "react";

export default class FormattedDate extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        let date = this.getPropValue("date");

        let locale = this.getPropValue("language");
        if(!locale) {
            locale = Dbm.repository.getItem("site").currentLanguageCode;
        }
        

        let temporalDate = null;
        
        try {
            temporalDate = Dbm.utils.TranslationFunctions.getDateAsTemporal(date);
        }
        catch(theError) {
            console.error("Can't parse date");
        }
        
        if(temporalDate === null || temporalDate === undefined) {
            return React.createElement("span", {"data-no-text-value": date});
        }

        let text = Dbm.utils.TranslationFunctions.getLocaleDate(temporalDate, this.getPropValueWithDefault("format", {calendar: "iso8601"}), locale);

        return text;
    }
}