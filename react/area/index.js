import Dbm from "../../index.js";
import React from "react";

export {default as InsertElement} from "./InsertElement.js";
export {default as HasData} from "./HasData.js";
export {default as ScrollActivatedArea} from "./ScrollActivatedArea.js";
export {default as OpenCloseExpandableArea} from "./OpenCloseExpandableArea.js";
export {default as ResponsiveLayout} from "./ResponsiveLayout.js";
export {default as List} from "./List.js";
export {default as FixedWidthInfiniteSlideshow} from "./FixedWidthInfiniteSlideshow.js";
export {default as SwitchableArea} from "./SwitchableArea.js";
export {default as PopoverLayer} from "./PopoverLayer.js";

export const responsiveLayout = function(aDefaultLayout) {
    let newResponsiveLayout = new Dbm.react.area.ResponsiveLayout();
    newResponsiveLayout.setDefaultLayout(aDefaultLayout);

    return newResponsiveLayout;
}

export const flexDiv = function(aChildren) {
    return React.createElement("div", {className: "flex-row"}, 
        React.createElement("div", {className: "flex-row-item"}, aChildren)
    );
}

export const centeredFlexDiv = function(aChildren) {
    return React.createElement("div", {className: "flex-row justify-center"}, 
        React.createElement("div", {className: "flex-row-item"}, aChildren)
    );
}