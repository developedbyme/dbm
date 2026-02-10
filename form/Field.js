import Dbm from "../index.js";

export default class Field extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let changeCommand = this._getScopedCallFunctionCommand(this._changed);
        let focusChangedCommand = this._getScopedCallFunctionCommand(this._focusChanged);
        let validationChangedCommand = this._getScopedCallFunctionCommand(this._validationActiveChange);

        this.item.requireProperty("value", null).addUpdate(changeCommand);

        let validation = new Dbm.form.validation.Validation();
        validation.item.field = this.item;
        validation.item.properties.active.addUpdate(validationChangedCommand);
        validation.item.properties.validationFunction.addUpdate(validationChangedCommand);

        this.item.requireProperty("validation", validation.item);
        this.item.requireProperty("editing", false).addUpdate(focusChangedCommand);
        this.item.requireProperty("valid", true);
        this.item.requireProperty("validationState", "notValidated");
        this.item.requireProperty("validationMode", null);
        this.item.requireProperty("focusMode", "reset");
    }

    validate() {
        let newState = this.item.valid ? "valid" : "invalid";
        this.item.validationState = newState;
    }

    getValue() {
        return this.item.value;
    }

    _validationActiveChange() {
        console.log("_validationActiveChange");
        if(this.item.validation.active) {
            this._changed();
        }
        else {
            this.item.valid = true;
        }
    }

    _changed() {
        console.log("_changed");
        this.item.valid = this.item.validation.controller.validate();

        if(this.item.validationMode === "onChange") {
            this.validate();
        }
    }

    _focusChanged() {
        console.log("_focus");
        if(this.item.editing) {
            if(this.item.focusMode === "reset") {
                this.item.validationState = "notValidated";
            }
        }
        else {
            if(this.item.validationMode === "onBlur") {
                this.validate();
            }
        }
    }
}