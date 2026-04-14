import Dbm from "../../index.js";
import React from "react";

export default class GlobalFilters extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._styleTag = null;

        let colorFilters = Dbm.getRepositoryItem("globalSvg");
        let filtersProperty = colorFilters.requireProperty("filters", []);

        filtersProperty.addUpdate(this._getScopedCallFunctionCommand(this._updateStyles));
        this._updateStyles();
    }

    _updateStyles() {
        console.log("_updateStyles");

        let colorFilters = Dbm.getRepositoryItem("globalSvg");
        console.log(colorFilters.filters.length);

        if(colorFilters.filters.length) {
            if(!this._styleTag) {
                this._styleTag = document.createElement("style");
                document.head.appendChild(this._styleTag);
            }

            let declarations = Dbm.utils.ArrayFunctions.mapField(colorFilters.filters, "classDeclaration");
            this._styleTag.innerHTML = declarations.join("\n");
            console.log(declarations);
        }
    }
}