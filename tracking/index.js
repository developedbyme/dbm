import Dbm from "../index.js";

export {default as Controller} from "./Controller.js";
export {default as DataLayerTracker} from "./DataLayerTracker.js";
export {default as MetaPixelTracker} from "./MetaPixelTracker.js";
export {default as TagManagerTracker} from "./TagManagerTracker.js";
export {default as GtagTracker} from "./GtagTracker.js";
export {default as SingleAccountMetaPixelTracker} from "./SingleAccountMetaPixelTracker.js";
export {default as PageListTracker} from "./PageListTracker.js";
export {default as ConversionLinker} from "./ConversionLinker.js";

export const addStartTagManagerMarker = function() {
    window.dataLayer=window.dataLayer || [];
	window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        "event": "gtm.js"
    });
}

export const setup = function() {
    
    let controller = new Dbm.tracking.Controller();
    controller.item.register("trackingController");

    controller.setupPermissionsFromCookies();
    controller.start();

    let dataLayerTracker = new Dbm.tracking.DataLayerTracker();
    dataLayerTracker.item.register("tracking/dataLayerTracker");
    controller.addTracker(dataLayerTracker.item);

    return controller;
}

export const setupExternalTagManager = function() {
    let controller = new Dbm.tracking.Controller();
    controller.item.register("trackingController");

    controller.item.allowStatistics = true;
    controller.item.allowMarketing = true;
    controller.start();

    let dataLayerTracker = new Dbm.tracking.DataLayerTracker();
    dataLayerTracker.item.setConsent = false;
    dataLayerTracker.item.register("tracking/dataLayerTracker");
    controller.addTracker(dataLayerTracker.item);

    return controller;
}

export const addMetaPixel = function(aPixelId) {
    let tracker = new Dbm.tracking.MetaPixelTracker();
    tracker.item.pixelId = aPixelId;
    tracker.item.register("tracking/metaPixelTracker");
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);

    return tracker;
}

export const addSingleAccountMetaPixel = function(aPixelId) {
    let tracker = new Dbm.tracking.SingleAccountMetaPixelTracker();
    tracker.item.pixelId = aPixelId;
    tracker.item.register("tracking/metaPixelTracker/" + aPixelId);
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);

    return tracker;
}

export const setCurrency = function(aCurrency) {
    Dbm.getRepositoryItem("trackingController").currency = aCurrency;
}

export const addTagManagerTracking = function(aId) {
    //console.log("addTagManagerTracking");
    let tracker = new Dbm.tracking.TagManagerTracker();
    tracker.item.tagManagerId = aId;
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);

    return tracker;
}

export const addGtagTracker = function(aId) {
    let tracker = new Dbm.tracking.GtagTracker();
    tracker.item.tagId = aId;
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);

    return tracker;
}

export const setupDefaultConversionLinker = function() {
    let tracker = new Dbm.tracking.ConversionLinker();
    Dbm.getRepositoryItem("trackingController").controller.addTracker(tracker.item);

    return tracker;
}