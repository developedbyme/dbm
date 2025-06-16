import Dbm from "../../../index.js";

export default class SingleSelection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let valueUpdatedCommand = Dbm.commands.callFunction(this._valueUpdated.bind(this));

        this._selectionChangedBound = this._selectionChanged.bind(this);

        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", null), valueUpdatedCommand);
        Dbm.flow.addUpdateCommand(this.item.requireProperty("selections", []), valueUpdatedCommand);

        this.item.requireProperty("matched", false);
    }

    addSelectionValue(aValue) {
        let selections = [].concat(this.item.selections);

        let property = new Dbm.flow.FlowProperty();
        property.setValue(false);
        Dbm.flow.addUpdateCommand(property, Dbm.commands.callFunction(this._selectionChangedBound, [property, aValue]));

        selections.push({"value": aValue, "property": property});
        this.item.selections = selections;

        return property;
    }

    _selectionChanged(aSelected, aValue) {
        console.log("_selectionChanged");
        console.log(aSelected, aValue);

        if(aSelected) {
            this.item.properties.value.getMostUpstreamProperty().setValue(aValue);
        }
        else {
            if(this.item.properties.value === aValue) {
                this.item.properties.value.getMostUpstreamProperty().setValue(null);
            }
        }
    }

    _valueUpdated() {
        //console.log("_valueUpdated");
        let value = this.item.value;

        let matched = false;

        let currentArray = this.item.selections;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentSelection = currentArray[i];
            if(currentSelection.value === value) {
                currentSelection.property.value = true;
                matched = true;
            }
            else {
                currentSelection.property.value = false;
            }
        }

        this.item.matched = matched;
    }
}