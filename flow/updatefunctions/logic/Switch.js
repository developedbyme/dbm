import Dbm from "../../../index.js";

export default class Switch extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", 0);
        this.input.register("defaultValue", null);
        this.input.register("cases", []);

        this.output.register("value", null);
    }

    addCase(aKey, aOutputValue) {

        let newCase = {key: aKey, value: aOutputValue};
        //METODO: connect key and value to flow

        let newCases = [].concat(this.input.cases);

        newCases.push(newCase);

        this.input.cases = newCases;

        return this;
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let currentArray = this.input.cases;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentCase = currentArray[i];

            if(value === currentCase["key"]) {
                this.output.value = currentCase["value"];
                return;
            }
        }

        this.output.value = this.input.defaultValue;
    }
}