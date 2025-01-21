import Dbm from "../../index.js";

export {default as AnimatedElement} from "./AnimatedElement.js";
export {default as AnimationController} from "./AnimationController.js";

export const freeStyleAnimation = function() {
    let newAnimationController = new Dbm.react.animation.AnimationController();

    let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
    newAnimationController.item.propertyInput("style", styleObject.output.properties.style);
    newAnimationController.item.setValue("styleProperties", styleObject);

    return newAnimationController;
}

export const connectedAnimation = function(aStyleProperty) {
    let newAnimationController = new Dbm.react.animation.AnimationController();

    newAnimationController.item.propertyInput("style", aStyleProperty);

    return newAnimationController;
}