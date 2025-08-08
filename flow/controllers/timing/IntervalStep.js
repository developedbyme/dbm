import Dbm from "../../../index.js";

export default class IntervalStep extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("value", 0);
        this.item.requireProperty("step", 1);
        Dbm.flow.addUpdateCommand(this.item.requireProperty("interval", 1), Dbm.commands.callFunction(this.resetInterval.bind(this)));

        this._started = false;
        this._intervalId = -1;
        this._callback_nextStepBound = this._callback_nextStep.bind(this);
    }

    start() {
        this._started = true;
        this._startInterval();

        return this;
    }

    stop() {
        this._started = false;
        this._stopInterval();

        return this;
    }

    setValue(aValue) {
        this.item.properties.value.getMostUpstreamProperty().value = aValue;
        this.resetInterval();

        return this;
    }

    _callback_nextStep() {
        this.item.properties.value.getMostUpstreamProperty().value += this.item.step;
    }

    _startInterval() {
        if(this._intervalId === -1) {
            this._intervalId = setInterval(this._callback_nextStepBound, this.item.interval*1000);
        }
    }

    _stopInterval() {
        if(this._intervalId !== -1) {
            clearInterval(this._intervalId);
            this._intervalId = -1;
        }
    }

    resetInterval() {
        if(this._started) {
            this._stopInterval();
            this._startInterval();
        }
    }
}