import React from "react";
import Dbm from "../../index.js";

export default class AnimationController extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let updateStyleCommand = Dbm.commands.callFunction(this._updateStyle.bind(this));

        Dbm.flow.addUpdateCommand(this.item.requireProperty("element", null), updateStyleCommand);
        Dbm.flow.addUpdateCommand(this.item.requireProperty("style", {}), updateStyleCommand);

        //METODO: add conversion to jsx

        this.item.requireProperty("jsxStyle", {});
    }

    _updateStyle() {
        //console.log("_updateStyle");
        let element = this.item.element;

        

        if(element) {
            
            let styleArray = [];
            
            let styleObject = this.item.style;
            for(let objectName in styleObject) {
                styleArray.push(objectName + ": " + styleObject[objectName]);
            }

            element.style = styleArray.join("; ");
        }

        
    }

    _convertStyleToJsx() {

    }

    insertElement(aChildren) {

        let reactElement = this.item.reactElement;
        if(!reactElement) {
            reactElement = React.createElement(Dbm.react.animation.AnimatedElement, {controller: this.item}, aChildren);
            this.item.setValue("reactElement", reactElement);
        }

        return reactElement;
    }
}