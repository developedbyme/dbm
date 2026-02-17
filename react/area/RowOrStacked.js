import React from "react";
import Dbm from "../../index.js";

export default class RowOrStacked extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("stackedChildren", []);
        this.item.setValue("rowChildren", []);
        this.item.requireProperty("spacingElement", null)

        let list = React.createElement(Dbm.react.area.List, {"items": this.item.properties.stackedChildren, "as": "element"},
            React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.contextVariable("element")}),
            React.createElement(Dbm.react.area.InsertElement, {"data-slot": "spacing", "element": this.item.properties.spacingElement})
        )

        let responsiveLayout = new Dbm.react.area.responsiveLayout(React.createElement("div", {}, list));

        let breakpoint = this.getPropValueWithDefault("breakpoint", 600);
        let rowClasses = "flex-row" + " " + this.getPropValueWithDefault("rowClassName", "");

        let rowList = React.createElement(Dbm.react.area.List, {"items": this.item.properties.rowChildren, "as": "element"},
            React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.contextVariable("element")})
        )

        responsiveLayout.addLayout(React.createElement("div", {"className": rowClasses}, rowList), breakpoint);

        this.item.setValue("responsiveLayout", responsiveLayout);
        

        let childrenProperty = this.getDynamicPropWithoutState("children", []);
        Dbm.flow.addUpdateCommand(childrenProperty, Dbm.commands.callFunction(this._updateSlots.bind(this)));

        this._updateSlots();
    }

    _updateSlots() {
        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));

        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);
        
        let spacing = slots["spacing"];
        this.item.stackedChildren = slots.main;

        let rowClasses = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.getPropValueWithDefault("rowClasses", []), ",", true);
        let rowClassesLength = rowClasses.length;

        let rowElements = []; 
        let currentArray = slots.main;
        if(currentArray) {
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {

                let rowClass = (i < rowClassesLength) ? rowClasses[i] : "";

                rowElements.push(
                    React.createElement("div", {"className": "flex-row-item" + " " + rowClass},
                        currentArray[i]
                    )
                )
            }
        }
        

        this.item.rowChildren = rowElements;

        this.item.spacingElement = spacing ? spacing :  React.createElement(React.Fragment);
    }

    _renderMainElement() {
        return this.item.responsiveLayout.mainElement;
    }
}

