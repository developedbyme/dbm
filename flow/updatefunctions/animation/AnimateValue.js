import Dbm from "../../../index.js";

export default class AnimateValue extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();

		this._animationInputValue = new Dbm.flow.FlowProperty();
		this._animationInputValue.value = 0;
		Dbm.flow.addUpdateCommand(this._animationInputValue, Dbm.commands.callFunction(this._updateAnimation.bind(this)));

		this._animatedValue = new Dbm.flow.FlowProperty();
		this._animatedValue.value = 0;
		Dbm.flow.addUpdateCommand(this._animatedValue, Dbm.commands.callFunction(this._animationUpdated.bind(this)));
        
        this.input.register("value", 0);
		this._animationInputValue.connectInput(this.input.properties.value);
		this.input.register("time", 0.5);
		this.input.register("easing", null);
		this.input.register("delay", 0);
		this.output.register("value", 0);
    }

    _update() {
        //console.log("_update");

        //this._animationInputValue.value = this.input.value;
    }

	_updateAnimation() {
		//console.log("_updateAnimation");
		this._animatedValue.animateValue(this._animationInputValue.value, this.input.time, this.input.delay, this.input.easing);
	}

	_animationUpdated() {
		//console.log("_animationUpdated");
		this.output.properties.value._internal_setValueInFlowOutsideOfUpdate(this._animatedValue.value);
	}
}