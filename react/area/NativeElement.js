import React from "react";
import Dbm from "../../index.js";

export default class NativeElement extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
        console.log(">>>>>>>>>>NativeElement", this)
    }

    _removedUsedProps(aProps) {
        delete aProps["element"];
    }

    componentDidMount() {

        let element = this.getPropValue("element");
		
        let parentElement = this.item.holderElement;
        if(element && parentElement) {
            parentElement.appendChild(element);
        }
    }

    componentDidUpdate() {

        let element = this.getPropValue("element");

        let parentElement = this.item.holderElement;
        //METODO: should we remove the old element?
        if(element && parentElement) {
            parentElement.appendChild(element);
        }
    }

    _renderMainElement() {
        return this._createMainElement("div", {"ref": this.createRef("holderElement")});
    }
}
