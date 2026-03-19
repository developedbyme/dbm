import Dbm from "../../../index.js";

export default class WindowSize extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();

        this.output.register("width", window.innerWidth);
        this.output.register("height", window.innerHeight);

        this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
    }

    start() {
        window.addEventListener("resize", this._callback_sizeChangedBound, false);

        return this;
    }

    _update() {
        //console.log("_update");

        this.output.width = window.innerWidth;
        this.output.height = window.innerHeight;
    }

    _callback_sizeChanged(aEvent) {
        //console.log("_callback_sizeChanged");

        this.output.properties.width._internal_setValueInFlowOutsideOfUpdate(window.innerWidth);
        this.output.properties.height._internal_setValueInFlowOutsideOfUpdate(window.innerHeight);
    }
}