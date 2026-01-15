import Dbm from "../../index.js";
import React from "react";

export {default as GlobalFilters} from "./GlobalFilters.js";
export {default as MatrixFilter} from "./MatrixFilter.js";

export const addGlobalRgbColorFilter = function(aName, aR, aG, aB) {

    let colorFilters = Dbm.getRepositoryItem("globalSvg");
    colorFilters.requireProperty("filters", []);

    let item = Dbm.getRepositoryItem("globalSvg/filters/" + aName);
    item.setValue("element", React.createElement(Dbm.react.svg.MatrixFilter, {"id": aName, "matrix": Dbm.utils.svg.ColorMatrixFunctions.floodColor(aR, aG, aB)}));

    let filters = [].concat(colorFilters.filters);
    filters.push(item);
    colorFilters.filters = filters;
    
    return item;
}

export const addGlobalHexColorFilter = function(aName, aColor) {
    let value;

    if (typeof aColor === "number") {
        value = aColor;
    }
    else {
        let hex = aColor.replace(/^#/, '');

        if(hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        value = parseInt(hex, 16);
    }
    
    let r = (value >> 16) & 255;
    let g = (value >> 8) & 255;
    let b = value & 255;

    return addGlobalRgbColorFilter(aName, r, g, b)
}