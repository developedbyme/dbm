import Dbm from "../index.js";

export {default as Controller} from "./Controller.js";
export {default as DataLayerTracker} from "./DataLayerTracker.js";
export {default as MetaPixelTracker} from "./MetaPixelTracker.js";

export const setup = function() {
    
    let controller = new Dbm.tracking.Controller();
    controller.item.register("trackingController");

    controller.setupPermissionsFromCookies();
    controller.start();

    let dataLayerTracker = new Dbm.tracking.DataLayerTracker();
    controller.addTracker(dataLayerTracker.item);
}

export const addMetaPixel = function(aPixelId) {
    let tracker = new Dbm.tracking.MetaPixelTracker();
    tracker.item.pixelId = aPixelId;
    Dbm.getInstance().repository.getItem("trackingController").controller.addTracker(tracker.item);
}

export const setCurrency = function(aCurrency) {
    Dbm.getInstance().repository.getItem("trackingController").currency = aCurrency;
}