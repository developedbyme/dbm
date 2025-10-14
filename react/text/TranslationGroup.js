import React from "react";
import Dbm from "../../index.js";

export default class TranslationGroup extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        
        let translationPath = this.context.translationPath;
        if(!translationPath) {
            translationPath = this.getPropValue("path");
        }
        else {
            translationPath += "/" + this.getPropValue("path");
        }

        let values = {};
        values["translationPath"] = translationPath;

        return React.createElement(Dbm.react.context.AddContextVariables, {"values": values}, this.getPropValue("children"));
    }
}