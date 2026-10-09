import Dbm from "../../index.js";
import React from "react";

export const fromContext = function(aPath) {
    return React.createElement(Dbm.react.text.Text, {text: Dbm.react.source.contextVariable(aPath)});
}