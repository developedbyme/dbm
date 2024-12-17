import Dbm from "../index.js";

export default class IntervalTimer extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("running", false);
        this._requestId = -1;
        this.item.setValue("update", function() {});

        this._updateBound = this._update.bind(this);
    }

    _update(aTime) {

        this.item.update(aTime);

    }

    start() {
        if(!this.item.running) {
            this.item.running = true;
            this._requestId = setInterval(this._updateBound, 10);
        }

        return this;
    }

    stop() {
        if(this.item.running) {
            this.item.running = false;
            if(this._requestId) {
                clearInterval(this._requestId);
                this._requestId = -1;
            }
        }
        
        return this;
    }
}