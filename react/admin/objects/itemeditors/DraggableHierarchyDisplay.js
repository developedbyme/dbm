import React from "react";
import Dbm from "../../../../index.js";

export default class DraggableHierarchyDisplay extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let children = this.getPropValue("children");

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddItemToContext, {"item": Dbm.react.source.contextVariable("hierarchyItem.linkedItem")},
                React.createElement(Dbm.react.interaction.drag.DraggableItem, {skipDraggable: true, moveMode: "insertBefore"},
                    React.createElement("div", {className: "flex-row micro-item-spacing"},
                        React.createElement("div", {className: "flex-row-item flex-no-resize cursor-grab", draggable: true},
                            React.createElement("div", {className: "spacing small"}),
                            React.createElement(Dbm.react.image.Image, {"src": "/assets/img/icons/drag-handle.svg", "className": "background-contain drag-handle-icon action-icon-color"})
                        ),
                        React.createElement("div", {className: "flex-row-item flex-resize"},
                            children
                        )
                    )
                    
                )      
            ),
            React.createElement("div", {className: "hierarchy-indent"},
                React.createElement("div", {className: "spacing small"}),
                React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("hierarchyItem.properties.children"), checkType: "notEmpty"},
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.contextVariable("hierarchyItem.properties.children"), as: "hierarchyItem"},
                        React.createElement(Dbm.react.admin.objects.itemeditors.DraggableHierarchyDisplay, {}, children),
                        React.createElement("div", {"data-slot": "spacing", className: "spacing small"}),
                    ),
                    React.createElement("div", {className: "spacing small"})
                ),
                React.createElement(Dbm.react.interaction.drag.DraggableItem, {skipDraggable: true, moveMode: "appendChild"},
                    React.createElement("div", {className: "append-drop-position centered-cell-holder"},
                        React.createElement("div", {})
                    )
                )
            )
        )
    }
}