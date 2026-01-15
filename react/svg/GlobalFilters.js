import Dbm from "../../index.js";
import React from "react";

export default class GlobalFilters extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let colorFilters = Dbm.getRepositoryItem("globalSvg");
        colorFilters.requireProperty("filters", []);

        return this._createMainElement("svg", {xmlns: "http://www.w3.org/2000/svg", style: {display: "none"}},
            React.createElement("defs", null, 
                React.createElement(Dbm.react.area.List, {items: colorFilters.properties.filters},
                    React.createElement(Dbm.react.area.InsertElement, {element: Dbm.react.source.item("element")})
                )
            )
        );
    }
}