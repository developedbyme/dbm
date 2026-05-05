import React from "react";
import Dbm from "../../index.js";

export default class SingleItemSlideshow extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let indexProperty = this.getDynamicProp("index", 0);
		
        this._contextData = {"index": indexProperty};
		this._sliderItems = {};
	}

    _removedUsedProps(aProps) {
        delete aProps["index"];
    }

    _getRecordForIndex(aIndex) {
        let currentRecord = this._sliderItems["i"+ aIndex];
        if(!currentRecord) {
            let currentItem = new Dbm.repository.Item();
            currentItem.setValue("index", aIndex);
            currentItem.setValue("envelope", 0);
            currentItem.setValue("localPosition", 0);

            currentRecord = {"item": currentItem, "contextData": {"sliderItem": currentItem}};
            this._sliderItems["i"+ aIndex] = currentRecord;
        }

        return currentRecord;
    }

    _renderMainElement() {

        let index = this.getPropValue("index");

        let elements = this.getPropValue("children");

		let numberOfElements = elements.length;
        
        let startIndex = Math.floor(index);
        let endIndex = Math.ceil(index);

        let children = [];
        for(let i = startIndex; i <= endIndex; i++) {
            let elementIndex = Dbm.utils.NumberFunctions.floatMod(i, numberOfElements);

            let currentRecord = this._getRecordForIndex(i);
            let indexItem = currentRecord.item;
            let localPosition = i-index;
            indexItem.localPosition = localPosition;
            let envelope = 1-Math.min(1, Math.abs(localPosition));
            indexItem.envelope = envelope;

            let child = React.createElement(React.Fragment, {"key": i},
                React.createElement(Dbm.react.context.AddContextVariables, {"values": currentRecord.contextData},
                    elements[elementIndex]
                )
            );
            children.push(child);
        }
        
		return React.createElement(React.Fragment, {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": this._contextData},
			    children
            )
		);
    }
}