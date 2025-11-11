import Dbm from "../../index.js";
import React from "react";

export default class Text extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        let rawText = this.getPropValue("text");
        let text = "" + this.getPropValue("text");

        if(rawText === null || rawText === undefined) {
            return React.createElement("span", {"data-no-text-value": text});
        }

        return text;
    }
}