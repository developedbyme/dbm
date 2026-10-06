import Dbm from "../../index.js";

export const floodColor = function(aR, aG, aB, aNumberOfDecimals = 4) {
    let values = "";

    values += "0 0 0 0 " + (aR/255).toFixed(aNumberOfDecimals) + " ";
    values += "0 0 0 0 " + (aG/255).toFixed(aNumberOfDecimals) + " ";
    values += "0 0 0 0 " + (aB/255).toFixed(aNumberOfDecimals) + " ";
    values += "0 0 0 1 0";

    return values;
}

export const multiplyColor = function(aR, aG, aB, aNumberOfDecimals = 4) {
    let values = "";

    values += (aR/255).toFixed(aNumberOfDecimals) + " 0 0 0 0" + " ";
    values += "0 " + (aG/255).toFixed(aNumberOfDecimals) + " 0 0 0" + " ";
    values += "0 0 " + (aB/255).toFixed(aNumberOfDecimals) + " 0 0" + " ";
    values += "0 0 0 1 0";

    return values;
}