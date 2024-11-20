import Dbm from "../../../index.js";

export default class ElementSize extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("element", null);

        this.output.register("width", 0);
        this.output.register("height", 0);

        this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
    }

    start() {
        window.addEventListener("resize", this._callback_sizeChangedBound, false);

        return this;
    }

    _update() {
        //console.log("_update");

        let element = this.input.element;

        if(element) {
            this.output.width = element.clientWidth;
            this.output.height = element.clientHeight;
        }
        else {
            this.output.width = 0;
            this.output.height = 0;
        }
    }

    _callback_sizeChanged(aEvent) {
        //console.log("_callback_sizeChanged");

        let element = this.input.element;

        if(element) {
            this.output.properties.width._internal_setValueInFlowOutsideOfUpdate(element.clientWidth);
            this.output.properties.height._internal_setValueInFlowOutsideOfUpdate(element.clientHeight);
        }
    }
}