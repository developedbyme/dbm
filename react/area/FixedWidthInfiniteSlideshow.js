import React from "react";
import Dbm from "../../index.js";

export default class FixedWidthInfiniteSlideshow extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		
	}

    _renderMainElement() {
        //console.log("FixedWidthInfiniteSlideshow::render");
        //console.log(this);

        let viewWidth = this.getPropValueWithDefault("viewWidth", 1000);
        let prepLength = this.getPropValueWithDefault("prepareLength", 20);
        let elementWidth = this.getPropValueWithDefault("elementWidth", 200);
        let spacing = this.getPropValueWithDefault("spacing", 0);

        let index = this.getPropValue("index");

        let elements = this.getPropValue("children");;

		let numberOfElements = elements.length;

        let stepLength = elementWidth+spacing;
        let movedLength = index*stepLength;
        
        let startPosition = movedLength-prepLength;
        let startIndex = Math.floor(startPosition/stepLength);

        let endPosition = (startPosition + viewWidth + 2*prepLength);
        let endIndex = Math.floor(endPosition/stepLength);

        let children = [];
        for(let i = startIndex; i <= endIndex; i++) {
            let currentPosition = i*stepLength-movedLength;
            let elementIndex = Dbm.utils.NumberFunctions.floatMod(i, numberOfElements);

            //METODO: send in styles instead of forcing full size
            let style = {"transform": "translateX(" + currentPosition + "px)", position: "absolute", left: 0, top: 0};
            let child = React.createElement("div", {"key": i, "className": "full-size", "style": style}, elements[elementIndex])
            children.push(child);
        }
        
		return this._createMainElement("div", {},
			children
		);
    }
}