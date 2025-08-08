import Dbm from "../../../index.js";

export {default as AnimateValue} from "./AnimateValue.js";

export let animateValue = function(aValue = 0, aTime = 0.5, aDelay = 0, aEasing = null) {
    let updateFunction = new Dbm.flow.updatefunctions.animation.AnimateValue();
    updateFunction.input.properties.value.setOrConnect(aValue);
    updateFunction.input.properties.time.setOrConnect(aTime);
    updateFunction.input.properties.delay.setOrConnect(aDelay);
    updateFunction.input.properties.easing.setOrConnect(aEasing);

    return updateFunction;
}