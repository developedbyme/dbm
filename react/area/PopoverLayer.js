import React from "react";
import Dbm from "../../index.js";

export default class PopoverLayer extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
        
        let startValue = this.getPropValue("startState") === "open";
        let openProperty = this.getDynamicPropWithoutState("open", startValue);
        Dbm.flow.addUpdateCommand(openProperty, Dbm.commands.callFunction(this._updateOpen.bind(this)));

        let holderElementProperty = this.item.requireProperty("holderElement", null);
        let popoverElementProperty = this.item.requireProperty("popoverElement", null);

        let position = new Dbm.flow.updatefunctions.dom.ElementPosition();
        this.item.setValue("position", position);
        position.input.properties.element.connectInput(holderElementProperty);
        position.start();

        let size = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("size", size);
        size.input.properties.element.connectInput(holderElementProperty);
        size.start();

        let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
        styleObject.addProperty("left", position.output.properties.pageX, "px");
        styleObject.addProperty("top", position.output.properties.pageY, "px");
        styleObject.addProperty("width", size.output.properties.width, "px");
        styleObject.addProperty("height", size.output.properties.height, "px");
        this.item.propertyInput("style", styleObject.output.properties.style);
    }

    _updateOpen() {
        console.log("_updateOpen");
        let open = this.getPropValue("open");
        console.log(open, this.item.popoverElement);

        this.item.position._callback_scroll(null);
        this.item.size._callback_sizeChanged(null);

        let element = Dbm.objectPath(this.item.popoverElement, "item.mainElement");
        if(element) {
            if(open) {
                element.showPopover();
            }
            else {
                element.hidePopover();
            }
        }
    }
    
    _renderMainElement() {
        //console.log("OpenCloseExpandableArea::_renderMainElement");
        //console.log(this);
        
        return this._createMainElement("div", {"ref": this.createRef("holderElement")},
            React.createElement(Dbm.react.BaseObject, {"className": "position-absolute popover-holder", style: this.item.properties.style, "popover": "manual", "ref": this.createRef("popoverElement")},
                this.getPropValue("children")
            )
        );
        
        return null;
    }
}

