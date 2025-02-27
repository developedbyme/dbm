import Dbm from "../../../index.js";

export default class EditValue extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("storedValue", null);
        this.item.requireProperty("value", null);

        let condition = Dbm.flow.updatefunctions.logic.condition(this.item.properties.storedValue, "!==", this.item.properties.value);

        this.item.requireProperty("changed", false).connectInput(condition.output.properties.result);
        this._setStoredValueBound = this._setStoredValue.bind(this);
    }

    get value() {
        return this.item.properties.value;
    }

    getValue() {
        return this.item.value;
    }

    setInitialValue(aValue) {
        this.item.storedValue = aValue;
        this.item.value = aValue;

        return this;
    }

    _setStoredValue(aValue) {
        this.item.storedValue = aValue;

        return this;
    }

    store() {
        this.item.properties.storedValue.getMostUpstreamProperty().storedValue = this.item.value;

        return this;
    }

    undo() {
        this.item.value = this.item.storedValue;

        return this;
    }

    getStoreCommand() {
        return Dbm.commands.callFunction(this._setStoredValueBound, [this.item.value]);
    }
}