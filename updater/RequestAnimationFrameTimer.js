import Dbm from "../index.js";

export default class RequestAnimationFrameTimer extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("running", false);
        this._requestId = 0;
        this.item.setValue("update", function() {});

        this._updateBound = this._update.bind(this);
    }

    _update(aTime) {

        this.item.update(aTime);

        if(this.item.running) {
            this.item.requestId = window.requestAnimationFrame(this._updateBound);
        }
    }

    start() {
        if(!this.item.running) {
            this.item.running = true;
            this._requestId = window.requestAnimationFrame(this._updateBound);
        }

        return this;
    }

    stop() {
        if(this.item.running) {
            this.item.running = false;
            if(this._requestId) {
                window.cancelAnimationFrame(this._requestId);
                this._requestId = 0;
            }
        }
        
        return this;
    }
}