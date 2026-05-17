import Dbm from "../../index.js";
import React from "react";

export {default as DesignRepositoryProxy} from "./DesignRepositoryProxy.js";
export {default as DynamicDesignElement} from "./DynamicDesignElement.js";

export const setupDesignItem = function(aItem, aElement, aPropNames = [], aSlots = []) {
    let DynamicDesignElement = class DynamicDesignElement extends Dbm.react.dynamic.DynamicDesignElement {
        _setupDesignElements() {
            this.item.setValue("structure", aItem);
        }
    }
    
    aItem.setValue("element", aElement);
    aItem.setValue("propNames", aPropNames);
    aItem.setValue("slots", aSlots);

    return DynamicDesignElement;
}

export const addDesign = function(aPath, aElement, aPropNames = [], aSlots = []) {
    let prefix = "react/design/";
    let fullPath = prefix+aPath;
    let item = Dbm.repository.getItem(fullPath);
    let DynamicDesignElement = setupDesignItem(item, aElement, aPropNames, aSlots);
    item.setValue("reactClass", DynamicDesignElement);

    return item;
}

export const setupDefaultDesignElements = function() {
    addDesign("buttons/PrimaryButton", React.createElement("div", {"className": "standard-button standard-button-padding"},
        React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.contextVariable("children")})
    ));

    addDesign("buttons/SecondaryButton", React.createElement("div", {"className": "secondary-button standard-button-padding"},
        React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.contextVariable("children")})
    ));

    addDesign("content/GridSectionCard", React.createElement("div", {"className": "grid-section-card"},
        React.createElement(Dbm.react.text.OptionalLink, {"href": Dbm.react.source.item("link.url"), "className": "custom-styled-link"},
            React.createElement("div", {"className": ""},
                React.createElement("div", {"className": "flex-row"},
                    React.createElement("div", {"className": "flex-row-item flex-no-ressize"},
                        "Icon"
                    ),
                    React.createElement("div", {"className": "flex-row-item flex-resize"},
                        React.createElement("div", {"className": "grid-section-card-title"},
                            Dbm.react.text.text(Dbm.react.source.item("title"))
                        )
                    )
                ),
                React.createElement("div", {"className": "spacing small"}),
                React.createElement("div", {"className": "grid-section-card-content"},
                    Dbm.react.text.htmlText(Dbm.react.source.item("content"), "div", {"className": "no-margins-around"})
                )
            )
        )
    ));
}
