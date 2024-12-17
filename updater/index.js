import Dbm from "../index.js";

export {default as PropertyUpdater} from "./PropertyUpdater.js";
export {default as RequestAnimationFrameTimer} from "./RequestAnimationFrameTimer.js";
export {default as IntervalTimer} from "./IntervalTimer.js";

let webSetup = function() {
    let updater = new Dbm.updater.PropertyUpdater();
    updater.item.register("propertyUpdater");

    let requestAnimationFrameTimer = new Dbm.updater.RequestAnimationFrameTimer();
    updater.setTimer(requestAnimationFrameTimer.item);

    updater.start();
}

export {webSetup};

let nodeSetup = function() {
    let updater = new Dbm.updater.PropertyUpdater();
    updater.item.register("propertyUpdater");

    let timer = new Dbm.updater.IntervalTimer();
    updater.setTimer(timer.item);

    updater.start();
}

export {nodeSetup};