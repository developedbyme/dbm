import React from "react";
import Dbm from "../../index.js";

export default class HoverDropdown extends Dbm.react.BaseObject {
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

        let dropClassName = "position-absolute full-width";

        return React.createElement(Dbm.react.interaction.HoverArea, {"over": openProperty},
            this._createMainElement("div", {className: "absolute-container"},
                React.createElement(Dbm.react.area.InsertElement, {"element": buttonElement}),
                React.createElement(Dbm.react.area.PopoverLayer, {className: "position-absolute bottom-left full-width", "open": openProperty},
                    React.createElement("div", {className: dropClassName},
                        React.createElement(Dbm.react.area.OpenCloseExpandableArea, {"open": openProperty},
                            React.createElement(Dbm.react.area.InsertElement, {"element": mainChildren})
                        )
                    )
                )
            )
        );
    }
}