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

        //top-right

        return this._createMainElement("div", {className: "absolute-container overflow-hidden"},
            React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.setProperty(openProperty, true)},
                React.createElement("div", {},
                    React.createElement(Dbm.react.area.InsertElement, {"element": buttonElement})
                )
            ),
            React.createElement(Dbm.react.area.PopoverLayer, {className: "position-absolute bottom-left full-width", "open": openProperty},
                React.createElement("div", {className: "dropdown-menu-min-width position-absolute"},
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