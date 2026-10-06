import Dbm from "../../../index.js";

export default class StringRepresentation extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let valueUpdatedCommand = Dbm.commands.callFunction(this._valueUpdated.bind(this));
        let stringUpdatedCommand = Dbm.commands.callFunction(this._stringUpdated.bind(this));

        this.item.requireProperty("validationFunction", null);
        this.item.requireProperty("valueFormatFunction", null);
        this.item.requireProperty("stringFormatFunction", null);
        this.item.requireProperty("value", null).addUpdate(valueUpdatedCommand);
        this.item.requireProperty("stringValue", "").addUpdate(stringUpdatedCommand);
        this.item.requireProperty("editing", false).addUpdate(valueUpdatedCommand);
        this.item.requireProperty("isValid", true);
        
    }

    _valueUpdated() {
        if(!this.item.editing) {

            let stringValue = ""+this.item.value;
            if(this.item.stringFormatFunction) {
                stringValue = this.item.stringFormatFunction.call(null, stringValue);
            }

            this.item.properties.stringValue.getMostUpstreamProperty().value = stringValue;
        }
    }

    _stringUpdated() {
        
        let isOk = true;
        let value = this.item.stringValue;
        if(this.item.validationFunction) {
            isOk = this.item.validationFunction.call(null, value);
        }

        this.item.isValid = isOk;

        if(!isOk) {
            return;
        }

        if(this.item.valueFormatFunction) {
            value = this.item.valueFormatFunction.call(null, value);
        }

        this.item.properties.value.getMostUpstreamProperty().value = value;
    }
}