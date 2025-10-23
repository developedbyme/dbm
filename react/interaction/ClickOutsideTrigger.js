import React from "react";
import Dbm from "../../index.js";

export default class ClickOutsideTrigger extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._callback_clickBound = this._callback_click.bind(this);
        document.body.addEventListener("click", this._callback_clickBound, true);
	}
	
	_callback_click(aEvent) {
		
		let commands = this.getPropValue("commands");
        if(!commands) {
            commands = this.getPropValue("command");
        }
        if(commands) {
            let currentElement = this.item["mainElement"];
            if(!currentElement.contains(aEvent.srcElement)) {
                commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);
                let currentArray = commands;
                let currentArrayLength = currentArray.length;
                for(let i = 0; i < currentArrayLength; i++) {
                    let command = currentArray[i];
                    try {
                        command.perform(this, aEvent);
                    }
                    catch(theError) {
                        console.error("Error while running command", theError, command);
                    }
                    
                }
            }
            
        }
        else{
            console.warn("Click outside doesn't have any commands", this);
        }
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		
		document.body.removeEventListener("click", this._callback_clickBound, true);
	}

    _renderMainElement() {

        return React.createElement("div", {"ref": this.createRef("mainElement")}, this.props.children);
    }
}

