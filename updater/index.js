import Dbm from "../index.js";

export {default as PropertyUpdater} from "./PropertyUpdater.js";
export {default as RequestAnimationFrameTimer} from "./RequestAnimationFrameTimer.js";

let webSetup = function() {
    let updater = new Dbm.updater.PropertyUpdater();
    updater.item.register("propertyUpdater");

    let requestAnimationFrameTimer = new Dbm.updater.RequestAnimationFrameTimer();
    updater.setTimer(requestAnimationFrameTimer.item);

    updater.start();
}

export {webSetup};