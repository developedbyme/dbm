import React from "react";
import Dbm from "../../index.js";

export default class MessureLayout extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        this.item.setValue("widthElement", null);
                
        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);
        elementSize.input.properties.element.connectInput(this.item.properties.widthElement);
        elementSize.start();

        let tabletWidth = this.getPropValueWithDefault("tabletWidth", 600);
        let desktopWidth = this.getPropValueWithDefault("desktopWidth", 900);

        let layoutSwitch = new Dbm.flow.updatefunctions.logic.RangeSwitch();
        this.item.setValue("layoutSwitch", layoutSwitch);
        layoutSwitch.input.defaultValue = "mobile";
        layoutSwitch.addValueForRange("tablet", tabletWidth, desktopWidth);
        layoutSwitch.addValueForRange("desktop", desktopWidth);
        layoutSwitch.input.properties.value.connectInput(elementSize.output.properties.width);

        this.item.requireProperty("layout", "mobile").connectInput(layoutSwitch.output.properties.value);

        
    }

    _renderMainElement() {

       let children =  this.getPropValue("children")

        return React.createElement("div", {ref: this.createRef("widthElement")},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"layout": this.item.properties.layout}},
                children
            )
        );
    }
}