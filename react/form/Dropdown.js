import React from "react";
import Dbm from "../../index.js";

export default class Dropdown extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let startValue = this.getPropValue("startState") === "open";
		let openProperty = this.getDynamicPropWithoutState("open", startValue);
    }

    _renderMainElement() {

        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));
        
        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);

        let buttonElement = slots["button"];
        let mainChildren = slots.main;

        let openProperty = this.getDynamicProp("open");

        let position = this.getPropValue("position");
        let dropClassName = "dropdown-menu-min-width position-absolute";
        if(position !== "right") {
            dropClassName += " " + "top-right";
        }

        return this._createMainElement("div", {className: "absolute-container overflow-hidden"},
            React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.setProperty(openProperty, true)},
                React.createElement("div", {"className": "cursor-pointer"},
                    React.createElement(Dbm.react.area.InsertElement, {"element": buttonElement})
                )
            ),
            React.createElement(Dbm.react.area.PopoverLayer, {className: "position-absolute bottom-left full-width", "open": openProperty},
                React.createElement("div", {className: dropClassName},
                    React.createElement(Dbm.react.area.OpenCloseExpandableArea, {"open": openProperty},
                        React.createElement(Dbm.react.interaction.ClickOutsideTrigger, {"command": Dbm.commands.setProperty(openProperty, false)},
                            React.createElement("div", {className: ""},
                                React.createElement(Dbm.react.area.InsertElement, {"element": mainChildren})
                            )
                        )
                    )
                )
            )
        );
    }
}