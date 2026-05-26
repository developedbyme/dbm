import React from "react";
import Dbm from "../../index.js";

export default class ModalDialog extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._isOpen = false;
        let updateCommand = this._getScopedCallFunctionCommand(this._updateOpen);
        
        let startValue = this.getPropValue("startState") === "open";
        let openProperty = this.getDynamicPropWithoutState("open", startValue);
        openProperty.addUpdate(updateCommand);

        let elementProperty = this.item.requireProperty("ref/mainElement", null);
        elementProperty.addUpdate(updateCommand);
        elementProperty.addUpdate(this._getScopedCallFunctionCommand(this._addCancelListener));
    }

    _removedUsedProps(aProps) {
        delete aProps["startState"];
        delete aProps["open"];
        delete aProps["preventKeyboardClosing"];
    }

    _updateOpen() {
        console.log("_updateOpen");
        let open = this.getPropValue("open");

        let element = this.item.mainElement;
        if(element) {
            console.log(this.item.mainElement, this.item);
            if(open && !this._isOpen) {
                element.showModal();
                this._isOpen = true;
            }
            else if(this._isOpen) {
                element.close();
                this._isOpen = false;
            }
        }
    }

    _addCancelListener() {
        console.log("_addCancelListener");
        let element = this.item.mainElement;
        if(element) {
            element.addEventListener("cancel", this._callback_cancel.bind(this), true);
        }
    }

    _callback_cancel(aEvent) {
        console.log("_callback_cancel");
        let preventKeyboardClosing = this.getPropValueWithoutNull("preventKeyboardClosing", false);
        console.log(preventKeyboardClosing);

        if(preventKeyboardClosing) {
            aEvent.preventDefault();
            aEvent.stopImmediatePropagation();

            if(!aEvent.defaultPrevented) {
                this._isOpen = false;
                this.item.properties["props/open"].getMostUpstreamProperty().value = false;
            }
        }
        else {
            this._isOpen = false;
            this.item.properties["props/open"].getMostUpstreamProperty().value = false;
        }
    }

    componentDidMount() {
        this._updateOpen();
    }
    
    _renderMainElement() {
        console.log("ModalDialog::_renderMainElement");
        console.log(this);
        
        return this._createMainElement("dialog", {"className": "modal-dialog", "ref": this.createRef("mainElement")},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties["props/open"]},
                React.createElement(Dbm.react.context.AddContextVariables, {"values": {"open": this.item.properties["props/open"]}},
                    this.getPropValue("children")
                )
            )
        );
    }
}

