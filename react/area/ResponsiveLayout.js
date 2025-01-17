import Dbm from "../../index.js";
import React from "react";

export default class ResponsiveLayout extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("widthElement", null);
        
        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);

        elementSize.input.properties.element.connectInput(this.item.properties.widthElement);
        elementSize.start();

        let layoutSwitch = new Dbm.flow.updatefunctions.logic.RangeSwitch();
        layoutSwitch.input.properties.value.connectInput(elementSize.output.properties.width);

        this.item.setValue("layoutSwitch", layoutSwitch)

        this.item.setValue("element", null);
        this.item.properties.element.connectInput(layoutSwitch.output.properties.value);

        let refToProperty = new Dbm.react.RefToProperty();
        refToProperty.property = this.item.properties.widthElement;
        this.item.setValue("ref/widthElement", refToProperty);

        this.item.setValue("mainElement", React.createElement("div", {ref: refToProperty},
            React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.element})
        ));
    }

    setDefaultLayout(aElement) {
        this.item.layoutSwitch.input.defaultValue = React.createElement(React.Fragment, {"key": "default"}, aElement);

        return this;
    }

    addLayout(aElement, aMinSize = null, aMaxSize = null) {
        this.item.layoutSwitch.addValueForRange(React.createElement(React.Fragment, {"key": "layout_" + this.item.layoutSwitch.input.ranges.length}, aElement), aMinSize, aMaxSize);

        return this;
    }

    get mainElement() {
        return this.item.mainElement;
    }
}