import Dbm from "../index.js";

export {default as Controller} from "./Controller.js";
export {default as DataLayerTracker} from "./DataLayerTracker.js";
export {default as MetaPixelTracker} from "./MetaPixelTracker.js";
export {default as TagManagerTracker} from "./TagManagerTracker.js";

export const setup = function() {
    
    let controller = new Dbm.tracking.Controller();
    controller.item.register("trackingController");

    controller.setupPermissionsFromCookies();
    controller.start();

    let dataLayerTracker = new Dbm.tracking.DataLayerTracker();
    dataLayerTracker.item.register("tracking/dataLayerTracker");
    controller.addTracker(dataLayerTracker.item);
}

export const addMetaPixel = function(aPixelId) {
    let tracker = new Dbm.tracking.MetaPixelTracker();
    tracker.item.pixelId = aPixelId;
    tracker.item.register("tracking/metaPixelTracker");
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);
}

export const setCurrency = function(aCurrency) {
    Dbm.getRepositoryItem("trackingController").currency = aCurrency;
}

export const addTagManagerTracking = function(aId) {
    //console.log("addTagManagerTracking");
    let tracker = new Dbm.tracking.TagManagerTracker();
    tracker.item.tagManagerId = aId;
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);
}