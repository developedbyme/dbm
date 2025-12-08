import React from "react";
import Dbm from "../../index.js";

export default class FixedWidthInfiniteSlideshow extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		this._sliderItems = {};
	}

    _removedUsedProps(aProps) {
        delete aProps["viewWidth"];
        delete aProps["prepareLength"];
        delete aProps["elementWidth"];
        delete aProps["spacing"];
        delete aProps["index"];
        delete aProps["startPositionOffset"];
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
        let elementWidth = this.getPropValueWithDefault("elementWidth", 200);
        let spacing = this.getPropValueWithDefault("spacing", 0);
        let startPositionOffset = this.getPropValueWithDefault("startPositionOffset", 0);
        let itemClasses = this.getPropValueWithDefault("itemClasses", "full-size");

        let index = this.getPropValue("index");

        let elements = this.getPropValue("children");

		let numberOfElements = elements.length;

        let stepLength = elementWidth+spacing;
        let movedLength = index*stepLength;
        
        let startPosition = movedLength-prepLength-startPositionOffset;
        let startIndex = Math.floor(startPosition/stepLength);

        let endPosition = (startPosition + viewWidth + 2*prepLength);
        let endIndex = Math.floor(endPosition/stepLength);

        let children = [];
        for(let i = startIndex; i <= endIndex; i++) {
            let currentPosition = i*stepLength-movedLength+startPositionOffset;
            let elementIndex = Dbm.utils.NumberFunctions.floatMod(i, numberOfElements);

            let indexItem = this._getItemForIndex(i);
            let localPosition = i-index;
            indexItem.localPosition = localPosition;
            let envelope = 1-Math.min(1, Math.abs(localPosition));
            indexItem.envelope = envelope;

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