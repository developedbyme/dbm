import React from "react";
import Dbm from "../../index.js";

export default class SlideshowSteps extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		this._sliderItems = {};

        this.getDynamicPropWithoutState("length", 0).addUpdate(this._getScopedCallFunctionCommand(this._updateSteps));
        let value = this.getDynamicPropWithoutState("value", 0);

        let singleSelection = new Dbm.flow.controllers.select.SingleSelection();
        singleSelection.item.properties.value.connectInput(value);
        this.item.requireProperty("singleSelection", singleSelection.item);

        this.item.requireProperty("steps", []);
	}

    _removedUsedProps(aProps) {
        delete aProps["length"];
        delete aProps["index"];
    }

    _updateSteps() {
        let numberOfSteps = this.item["props/length"];
        let steps = [];

        for(let i = 0; i < numberOfSteps; i++) {
            let selectionProperty = this.item.singleSelection.controller.addSelectionValue(i);
            steps.push({"id": i, "selected": selectionProperty});
        }

        this.item.steps = steps;
        console.log(this.item.steps);
    }

    _renderMainElement() {
        let elements = this.getPropValue("children");

        return this._createMainElement(Dbm.react.area.List, {"items": this.item.properties.steps},
            React.createElement(Dbm.react.interaction.Checked, {"checked": Dbm.react.source.item("selected"), "preventUncheck": true}, elements)
        );
    }
}