import Dbm from "../../index.js";
import React from "react";

export default class BlendColorFilter extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        delete aProps["id"];
        delete aProps["color"];
        delete aProps["blendMode"];
        delete aProps["saturation"];
        delete aProps["min"];
        delete aProps["max"];
    }

    _renderMainElement() {

        let id = this.getPropValue("id");
        let color = this.getPropValue("color");

        let blendMode = this.getPropValueWithoutNull("blendMode", "multiply");
        let saturation = this.getPropValueWithoutNull("saturation", 0);
        let min = this.getPropValueWithoutNull("min", 0);
        let max = this.getPropValueWithoutNull("max", 1);

        let scale = max-min;

        //MENOTE: React converts floodColor to flood-color
        return this._createMainElement("filter", {id: id, colorInterpolationFilters: "sRGB", x: "0%", y: "0%", width: "100%", height: "100%"},
            React.createElement("feColorMatrix", {type: "saturate", values: saturation, result: "saturated"}),
            React.createElement("feComponentTransfer", {in: "saturated", result: "scaled"},
                React.createElement("feFuncR", {type: "linear", slope: scale, intercept: min}),
                React.createElement("feFuncG", {type: "linear", slope: scale, intercept: min}),
                React.createElement("feFuncB", {type: "linear", slope: scale, intercept: min}),
            ),
            React.createElement("feFlood", {floodColor: color, result: "tint", floodOpacity: "1", x: "0%", y: "0%", width: "100%", height: "100%"}),
            React.createElement("feBlend", {in: "scaled", in2: "tint", mode: blendMode})
        );
    }
}