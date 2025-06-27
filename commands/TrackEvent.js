import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class TrackEvent extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("eventName", null);
        this.item.setValue("additionalData", {});
    }

    perform(aFromObject, aData) {
		let trackingController = Dbm.getInstance().repository.getItem("trackingController").controller;

        trackingController.trackEvent(this.item.eventName, this.item.additionalData);
        
    }
}