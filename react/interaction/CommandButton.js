import React from "react";
import Dbm from "../../index.js";

export default class CommandButton extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._callback_clickBound = this._callback_click.bind(this);
    }

    _callback_click(aEvent) {
        //console.log("_callback_click");
        //console.log(aEvent);

        let commands = this.getPropValue("commands");
        if(!commands) {
            commands = this.getPropValue("command");
        }
        if(commands) {
            commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);
            Dbm.commands.performCommands(commands, this, aEvent);
        }
        else{
            console.warn("Button doesn't have any commands", this);
        }
    }

    _performClone(aChild, aProps) {
		
		if(aChild instanceof Array) {
			let returnArray = [];
			
			let currentArray = aChild;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentChild = currentArray[i];
				returnArray.push(this._performClone(currentChild, aProps));
			}
			
			return returnArray;
		}
		
		let newProps = aProps;
        /*
        //MENOTE: this is a more generalized version, but we never pass in className in this function
        if(aChild && aChild.props && aChild.props.className) {
			newProps = {...aProps};
            
			if(aProps.className) {
				newProps.className = aProps.className + " " + aChild.props.className;
			} 
			else {
				newProps.className = aChild.props.className;
			}
		}
        */
		
		
		let callArray = [aChild, newProps];
		
		if(aChild && aChild.props) {
			let firstChildChildren = aChild.props.children;
			if(!firstChildChildren) {
				//MENOTE: do nothing
			}
			else if(firstChildChildren instanceof Array) {
				callArray = callArray.concat(firstChildChildren);
			}
			else {
				callArray.push(firstChildChildren);
			}
		}
		
		return React.cloneElement.apply(React, callArray);
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
                    replacedChildren.push(React.createElement("span", {"onClick": this._callback_clickBound, onKeyDown: CommandButton.callback_keyDown}, currentChild));
                }
                else {
                    replacedChildren.push(this._performClone(currentChild, {"onClick": this._callback_clickBound, onKeyDown: CommandButton.callback_keyDown}));
                }
            }
            else {
                replacedChildren.push(currentChild);
            }
        }
        

        return React.createElement(React.Fragment, {}, replacedChildren);
    }

    static callback_keyDown(aEvent) {
        if(aEvent.key === "Enter") {
            aEvent.target.click();
        }
    }
}

