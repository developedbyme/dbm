import React from "react";
import Dbm from "../../index.js";

export default class RepeatedSlider extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		this._sliderItems = {};
	}

    _removedUsedProps(aProps) {
        delete aProps["viewWidth"];
        delete aProps["prepareLength"];
        delete aProps["spacing"];
        delete aProps["position"];
        delete aProps["itemClasses"];
    }

    _getItemForIndex(aIndex) {
        let currentItem = this._sliderItems["i"+ aIndex];
        if(!currentItem) {
            currentItem = new Dbm.repository.Item();
            currentItem.setValue("index", aIndex);
            currentItem.setValue("envelope", 0);
            currentItem.setValue("localPosition", 0);
            this._sliderItems["i"+ aIndex] = currentItem;
        }

        return currentItem;
    }

    _renderMainElement() {
        //console.log("FixedWidthInfiniteSlideshow::render");
        //console.log(this);

        let viewWidth = this.getPropValueWithDefault("viewWidth", 1000);
        let prepLength = this.getPropValueWithDefault("prepareLength", 20);
        let spacing = this.getPropValueWithDefault("spacing", 0);
        let itemClasses = this.getPropValueWithDefault("itemClasses", "");

        let position = this.getPropValueWithDefault("position", 0);

        let elements = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));

		let numberOfElements = elements.length;

        let length = 400;

        let startIndex = Math.floor(position/length);

        let endIndex = startIndex+10; //Math.floor(position);

        let children = [];
        for(let i = startIndex; i <= endIndex; i++) {
            let currentPosition = i*length-position;
            let elementIndex = Dbm.utils.NumberFunctions.floatMod(i, numberOfElements);

            let indexItem = this._getItemForIndex(i);

            let style = {"transform": "translateX(" + currentPosition + "px)", position: "absolute", left: 0, top: 0};
            let child = React.createElement("div", {"key": i, "className": itemClasses, "style": style},
                React.createElement(Dbm.react.context.AddContextVariables, {"values": {"sliderItem": indexItem}},
                    elements[elementIndex]
                )
            );
            children.push(child);
        }
        
		return this._createMainElement("div", {},
			children
		);
    }
}