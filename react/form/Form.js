import React from "react";
import Dbm from "../../index.js";

export default class Form extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._callback_submitBound = this._callback_submit.bind(this);
    }

    _callback_submit(aEvent) {
        //console.log("_callback_submit");
        //console.log(aEvent);

        let preventSubmit = this.getPropValue("preventSubmit");
        if(preventSubmit) {
            aEvent.preventDefault();
        }

        let commands = this.getPropValue("commands");
        if(!commands) {
            commands = this.getPropValue("command");
        }
        if(commands) {
            aEvent.preventDefault();
            commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);

            let currentArray = commands;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let command = currentArray[i];
                command.perform(this, aEvent);
            }
        }
        else{
            return !preventSubmit;
        }

        return false;
    }

    _renderMainElement() {

        let children = this.getPropValue("children");

        return this._createMainElement("form", {onSubmit: this._callback_submitBound}, children);
    }
}

