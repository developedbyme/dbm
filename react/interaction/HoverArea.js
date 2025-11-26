import React from "react";
import Dbm from "../../index.js";

export default class HoverArea extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicPropWithoutState("over", false);

        this._callback_overBound = this._callback_over.bind(this);
        this._callback_outBound = this._callback_out.bind(this);
    }

    _callback_over(aEvent) {
        //console.log("_callback_over");
        //console.log(aEvent);

        this.getDynamicProp("over").getMostUpstreamProperty().setValue(true);

        let commands = this.getPropValue("overCommands");
        if(!commands) {
            commands = this.getPropValue("overCommand");
        }
        if(commands) {
            commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);
            Dbm.commands.performCommands(commands, this, aEvent);
        }
    }

    _callback_out(aEvent) {
        //console.log("_callback_out");
        //console.log(aEvent);

        this.getDynamicProp("over").getMostUpstreamProperty().setValue(false);

        let commands = this.getPropValue("outCommands");
        if(!commands) {
            commands = this.getPropValue("outCommand");
        }
        if(commands) {
            commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);
            Dbm.commands.performCommands(commands, this, aEvent);
        }
    }

    _renderMainElement() {

        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));

        let replacedChildren = [];

        let currentArray = children;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentChild = currentArray[i];
            if(currentChild) {
                if(typeof(currentChild) === "string") {
                    replacedChildren.push(React.createElement("span", {"onMouseEnter": this._callback_overBound, onMouseLeave: this._callback_outBound}, currentChild));
                }
                else {
                    replacedChildren.push(Dbm.react.ChildFunctions.clone(currentChild, {"onMouseEnter": this._callback_overBound, onMouseLeave: this._callback_outBound}));
                }
            }
            else {
                replacedChildren.push(currentChild);
            }
        }


        if(currentArrayLength === 1) {
            return replacedChildren[0];
        }

        return React.createElement(React.Fragment, {}, replacedChildren);
    }
}

