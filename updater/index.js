import { Easing } from "@tweenjs/tween.js";
import Dbm from "../index.js";

export {default as PropertyUpdater} from "./PropertyUpdater.js";
export {default as RequestAnimationFrameTimer} from "./RequestAnimationFrameTimer.js";
export {default as IntervalTimer} from "./IntervalTimer.js";

export const webSetup = function() {
    let updater = new Dbm.updater.PropertyUpdater();
    updater.item.register("propertyUpdater");

    let requestAnimationFrameTimer = new Dbm.updater.RequestAnimationFrameTimer();
    updater.setTimer(requestAnimationFrameTimer.item);

    updater.start();
}

export const setupEasingFunctions = function() {
    let item = Dbm.getRepositoryItem("easingFunctions");

    item.setValue("easeOut", Easing.Quadratic.Out);
    item.setValue("easeIn", Easing.Quadratic.In);
}

export const nodeSetup = function() {
    let updater = new Dbm.updater.PropertyUpdater();
    updater.item.register("propertyUpdater");

    let timer = new Dbm.updater.IntervalTimer();
    updater.setTimer(timer.item);

    updater.start();
}