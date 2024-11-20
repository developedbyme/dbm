import Dbm from "../../../index.js";

export default class Log extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("annotation", null);
        this.input.register("value", null);

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let annotation = this.input.annotation;
        if(annotation) {
            console.log(annotation, value);
        }
        else {
            console.log(value);
        }
        

        this.output.value = value;
    }
}