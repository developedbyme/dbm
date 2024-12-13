import Dbm from "../../../index.js";

export default class RunCommand extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("baseObject", this);
        this.input.register("command", null);
        this.input.register("value", null);

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let command = this.input.command;
        let outputValue = command.perform(this.input.baseObject, value);

        this.output.value = outputValue;
    }

    noFirstTriggger() {
        this.input.updateValues();
        this.output.markAsClean();
        this.isDirty = false;

        return this;
    }
}