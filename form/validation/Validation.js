import Dbm from "../../index.js";

export default class Validation extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("field", null);
        this.item.requireProperty("active", true);
        this.item.requireProperty("validationFunction", Dbm.form.validation.ValidationFunctions.noValidation);
    }

    validate() {
        if(!this.item.active) {
            return true;
        }
        let validationFunction = this.item.validationFunction;
        return validationFunction(this.item);
    }

    static noValidation(aValidation) {
        return true;
    }
}