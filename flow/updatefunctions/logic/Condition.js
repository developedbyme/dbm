import Dbm from "../../../index.js";

export default class Condition extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("input1", null);
        this.input.register("operation", function(aA, aB) {return aA === aB;});
        this.input.register("input2", null);

        this.output.register("result", true);
    }

    _update() {
        //console.log("_update");

        let operation = this.input.operation;
        if(typeof(operation) === "string") {
            if(operation === "!==") {
                operation = function(aA, aB) {return aA !== aB;}
            }
            else {
                //METODO: add more operations
                operation = function(aA, aB) {return aA === aB;}
            }
        }

        this.output.result = operation.call(this, this.input.input1, this.input.input2);
    }
}