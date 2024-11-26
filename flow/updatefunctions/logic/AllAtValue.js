import Dbm from "../../../index.js";

export default class AllAtValue extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("matchValue", 1);
        this.input.register("checks", []);

        this.output.register("value", false);
    }

    addCheck(aValue) {

        let checks = [].concat(this.input.checks);

        let property = this.input.register("property_" + checks.length, null).setOrConnect(aValue);

        checks.push(property);

        this.input.checks = checks;

        return this;
    }

    _update() {
        //console.log("_update");

        let matchValue = this.input.matchValue;
        let returnValue = true;

        let currentArray = this.input.checks;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentProperty = currentArray[i];

            if(currentProperty.value !== matchValue) {
                returnValue = false;
                break;
            }
        }

        this.output.value = returnValue;
    }
}