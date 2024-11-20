import Dbm from "../index.js";

export {default as Controller} from "./Controller.js";
export {default as DataLayerTracker} from "./DataLayerTracker.js";

export let setup = function() {
    
    let controller = new Dbm.tracking.Controller();
    controller.item.register("trackingController");

    controller.setupPermissionsFromCookies();
    controller.start();

    let dataLayerTracker = new Dbm.tracking.DataLayerTracker();
    controller.addTracker(dataLayerTracker.item);
}