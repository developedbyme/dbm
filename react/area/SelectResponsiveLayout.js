import React from "react";
import Dbm from "../../index.js";

export default class SelectResponsiveLayout extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let defaultLayout = this.getPropValueWithDefault("defaultLayout", "mobile");

        this.item.requireProperty("widthElement", null);

        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);

        elementSize.input.properties.element.connectInput(this.item.properties.widthElement);
        elementSize.start();

        let layoutSwitch = new Dbm.flow.updatefunctions.logic.RangeSwitch();
        layoutSwitch.input.properties.value.connectInput(elementSize.output.properties.width);
        this.item.setValue("layoutSwitch", layoutSwitch);

        layoutSwitch.input.defaultValue = defaultLayout;

        let layouts = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.getPropValueWithDefault("layouts", "600:desktop"), ",", true);
        console.log(layouts);

        let encodedLayouts = [];
        {
            let currentEncodedLayout = null;

            let currentArray = layouts;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let tempArray = currentArray[i].split(":");
                let size = 1*tempArray[0];
                let name = tempArray[1];

                if(currentEncodedLayout) {
                    currentEncodedLayout["max"] = size;
                }
                
                currentEncodedLayout = {
                    "name": name,
                    "min": size,
                    "max": null
                }

                encodedLayouts.push(currentEncodedLayout);
            }
        }
        
        {
            let currentArray = encodedLayouts;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentEncodedLayout = currentArray[i];
                this.item.layoutSwitch.addValueForRange(currentEncodedLayout["name"], currentEncodedLayout["min"], currentEncodedLayout["max"]);

            }
        }
        

        

        this.item.requireProperty("layout", defaultLayout).connectInput(layoutSwitch.output.properties.value);
        this.item.properties.layout
    }

    _renderMainElement() {
        return React.createElement("div", {ref: this.createRef("widthElement")},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"layout": this.item.properties.layout}},
                this.getPropValue("children")
            )
        );
    }
}

