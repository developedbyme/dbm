import Dbm from "../../../index.js";

export default class InArray extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let valuesUpdatedCommand = Dbm.commands.callFunction(this._valuesUpdated.bind(this));

        this._selectionChangedBound = this._selectionChanged.bind(this);

        Dbm.flow.addUpdateCommand(this.item.requireProperty("values", null), valuesUpdatedCommand);
        this.item.requireProperty("selections", []);

    }

    getSelectionForValue(aValue) {
        let selections = this.item.selections;
        let currentSelection = Dbm.utils.ArrayFunctions.getItemByIfExists(selections, "value", aValue);

        if(!currentSelection) {
            let selections = [].concat(this.item.selections);
            let property = new Dbm.flow.FlowProperty();
            property.setValue(false);
            Dbm.flow.addUpdateCommand(property, Dbm.commands.callFunction(this._selectionChangedBound, [property, aValue]));

            currentSelection = {"value": aValue, "property": property};
            selections.push(currentSelection);
            this.item.selections = selections;
        }

        return currentSelection.property;
    }

    _selectionChanged(aSelected, aValue) {
        console.log("_selectionChanged");

        let newValues = [].concat(this.item.values);
        if(aSelected) {
            newValues.push(aValue);
        }
        else {
            let index = newValues.indexOf(aValue);
            if(index >= 0) {
                newValues.splice(index, 1);
            }
        }

        this.item.properties.values.getMostUpstreamProperty().setValue(newValues);
    }

    _valuesUpdated() {
        //console.log("_valuesUpdated");
        let values = this.item.values;

        let currentArray = this.item.selections;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentSelection = currentArray[i];
            if(values.indexOf(currentSelection.value) !== -1) {
                currentSelection.property.getMostUpstreamProperty().setValue(true);
            }
            else {
                currentSelection.property.getMostUpstreamProperty().setValue(false);
            }
        }
    }
}