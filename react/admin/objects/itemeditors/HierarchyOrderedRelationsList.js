import React from "react";
import Dbm from "../../../../index.js";

export default class HierarchyOrderedRelationsList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._internalId = Dbm.getInstance().getNextId();
        let itemEditor = this.context.itemEditor;

        this._draggedElement = null;
        this._hierachyMap = {};

        let hierarchyHolder = new Dbm.repository.Item();
        hierarchyHolder.setValue("children", []);

        this.item.requireProperty("hierarchy", hierarchyHolder);

        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");

        let orderFieldName = this.getPropValue("orderFieldName");

        this._relationsEditor;
        if(direction === "in") {
            this._relationsEditor = itemEditor.getAdminMultipleIncomingRelationsEditor(relationType, objectType);
        }
        else if(direction === "out") {
            this._relationsEditor = itemEditor.getAdminMultipleOutgoingRelationsEditor(relationType, objectType);
        }
        else {
            console.error("Unknown direction", direction, this);
        }

        this._orderEditor = itemEditor.getAdminFieldEditor(orderFieldName);

        let updateCommand = Dbm.commands.callFunction(this._updateHierarchy.bind(this));

        Dbm.flow.addUpdateCommand(this._relationsEditor.valueProperty, updateCommand);
        Dbm.flow.addUpdateCommand(this._orderEditor.valueProperty, updateCommand);
        this._updateHierarchy();
        
    }

    _removeMissingPartsOfHierarchy(aHierarchy, aMustBeInArray) {
        //console.log("_removeMissingPartsOfHierarchy");
        //console.log(aHierarchy, aMustBeInArray);
        let currentArray = aHierarchy;
        let currentArrayLength = currentArray.length;

        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            if(aMustBeInArray.indexOf(currentItem.id) !== -1) {
                this._removeMissingPartsOfHierarchy(currentItem.children, aMustBeInArray);
            }
        }
    }

    _getAllIdsFromHierarchy(aItems, aReturnArray) {
        let currentArray = aItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];

            aReturnArray.push(currentItem.id);
            this._getAllIdsFromHierarchy(currentItem.children, aReturnArray);
        }
    }

    _getFullHierarchy() {
        let relations = this._relationsEditor.value;
        let hierarchyValue = this._orderEditor.value;
        if(hierarchyValue) {
            hierarchyValue = JSON.parse(JSON.stringify(hierarchyValue));
        }
        else {
            hierarchyValue = [];
        }

        this._removeMissingPartsOfHierarchy(hierarchyValue, relations);

        let usedIds = [];

        this._getAllIdsFromHierarchy(hierarchyValue, usedIds);
        let missingIds = Dbm.utils.ArrayFunctions.getUnselectedItems(usedIds, relations);

        {

            let currentArray = missingIds;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentId = currentArray[i];
                hierarchyValue.push({id: currentId, children: []});
            }
        }

        return hierarchyValue;
    }

    _updateHierarchy() {
        this._updateHierarchyItems(this.item.hierarchy, this._getFullHierarchy());
    }

    _getHierarchyItem(aId) {
        let returnItem = this._hierachyMap["item" + aId];
        if(!returnItem) {
            returnItem = new Dbm.repository.Item();
            returnItem.setId("_internalHierarchy/" + this._internalId + "/" + aId);
            returnItem.setValue("linkedItem", Dbm.getRepositoryItem(aId));
            returnItem.setValue("children", []);
            this._hierachyMap["item" + aId] = returnItem;
        }

        return returnItem;
    }

    _updateHierarchyItems(aHierarchyItem, aItems) {
        //console.log("_updateHierarchyItems");
        let newItems = [];
        let hierarchyChildren = aHierarchyItem.children;
        let hasChange = (hierarchyChildren.length !== aItems.length);

        let currentArray = aItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            let hierarchyItem = this._getHierarchyItem(currentItem.id);
            newItems.push(hierarchyItem);
            this._updateHierarchyItems(hierarchyItem, currentItem.children);
            if(!hasChange && hierarchyChildren[i] !== hierarchyItem) {
                hasChange = true;
            }
        }

        if(hasChange) {
            aHierarchyItem.children = newItems;
        }
    }

    startDrag(aComponent) {
        console.log("startDrag");
        console.log(aComponent);

        this._draggedElement = aComponent;
    }

    _findPosition(aItem, aChildren) {
        let index = aChildren.indexOf(aItem);
        if(index !== -1) {
            return [index];
        }

        let currentArray = aChildren;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentChild = currentArray[i];
            let childIndex = this._findPosition(aItem, currentChild.children);
            if(childIndex) {
                childIndex.unshift(i)
                return childIndex;
            }
        }

        return null;
    }

    _isInside(aLastPosition, aNewPosition) {
        return aNewPosition.join(".").indexOf(aLastPosition.join(".")) === 0;
    }

    itemDroppedOn(aComponent, aData) {
        //console.log("itemDroppedOn");
        //console.log(aComponent, aData);

        let mode = aComponent.getPropValue("moveMode");

        console.log(mode);

        let hierarchyValue = this._getFullHierarchy();

        if(mode === "insertBefore") {
            
            let lastDeepIndex = this._findPosition(this._draggedElement.context.hierarchyItem, this.item.hierarchy.children);
            let newDeepIndex = this._findPosition(aComponent.context.hierarchyItem, this.item.hierarchy.children);

            if(this._isInside(lastDeepIndex, newDeepIndex)) {
                return;
            }

            let removeIndex = lastDeepIndex.pop();
            let removeArray;
            if(lastDeepIndex.length === 0) {
                removeArray = hierarchyValue;
            }
            else {
                removeArray = Dbm.objectPath(hierarchyValue, lastDeepIndex.join(".children.") + ".children");
            }
            
            let addIndex = newDeepIndex.pop();
            let addArray;
            if(newDeepIndex.length === 0) {
                addArray = hierarchyValue;
            }
            else {
                addArray = Dbm.objectPath(hierarchyValue, newDeepIndex.join(".children.") + ".children");
            }

            let movedItem = removeArray.splice(removeIndex, 1)[0];

            if(addIndex > removeIndex && removeArray === addArray) {
                addIndex--;
            }

            addArray.splice(addIndex, 0, movedItem);
        }
        else if(mode === "appendChild") {
            let lastDeepIndex = this._findPosition(this._draggedElement.context.hierarchyItem, this.item.hierarchy.children);
            let newDeepIndex = this._findPosition(aComponent.context.hierarchyItem, this.item.hierarchy.children);

            if(this._isInside(lastDeepIndex, newDeepIndex)) {
                return;
            }

            let removeIndex = lastDeepIndex.pop();
            let removeArray;
            if(lastDeepIndex.length === 0) {
                removeArray = hierarchyValue;
            }
            else {
                removeArray = Dbm.objectPath(hierarchyValue, lastDeepIndex.join(".children.") + ".children");
            }
            
            let addArray = Dbm.objectPath(hierarchyValue, newDeepIndex.join(".children.") + ".children");

            let movedItem = removeArray.splice(removeIndex, 1)[0];
            addArray.push(movedItem);
        }
        else if(mode === "last") {
            let lastDeepIndex = this._findPosition(this._draggedElement.context.hierarchyItem, this.item.hierarchy.children);
            
            let removeIndex = lastDeepIndex.pop();
            let removeArray;
            if(lastDeepIndex.length === 0) {
                removeArray = hierarchyValue;
            }
            else {
                removeArray = Dbm.objectPath(hierarchyValue, lastDeepIndex.join(".children.") + ".children");
            }
            
            let addArray = hierarchyValue;

            let movedItem = removeArray.splice(removeIndex, 1)[0];
            addArray.push(movedItem);
        }

        this._orderEditor.value = hierarchyValue;
    }

    _create() {
        console.log("_create");
        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["id"]);
        let visibility = this.getPropValueWithDefault("visibility", "private");

        let changes = [];

        let request = Dbm.getGraphApi().createItem([objectType], visibility, changes, encodings);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._created.bind(this), [Dbm.core.source.staticObject(request, "item")]));
    }

    _created(aItem) {
        console.log("_created");
        console.log(aItem);

        let itemEditor = this.context.itemEditor;

        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");

        let editor;
        if(direction === "in") {
            editor = itemEditor.getAdminMultipleIncomingRelationsEditor(relationType, objectType);
        }
        else if(direction === "out") {
            editor = itemEditor.getAdminMultipleOutgoingRelationsEditor(relationType, objectType);
        }
        else {
            console.error("Unknown direction", direction, this);
        }

        let newValues = [].concat(editor.value);
        newValues.push(aItem.id);
        editor.value = newValues;
    }

    _renderMainElement() {

        let label = this.getPropValue("label");
        let children = this.getPropValue("children");

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"dragController": this}},
                React.createElement(Dbm.react.form.LabelledArea, {label: label}), 
                React.createElement("div", {"className": ""},
                    React.createElement(Dbm.react.area.List, {items: this.item.hierarchy.properties.children, as: "hierarchyItem"},
                        React.createElement(Dbm.react.context.AddItemToContext, {"item": Dbm.react.source.contextVariable("hierarchyItem.linkedItem")},
                            React.createElement(Dbm.react.admin.objects.itemeditors.DraggableHierarchyDisplay, {},
                                children
                            )
                        ),
                        React.createElement("div", {"data-slot": "spacing", className: "spacing small"})
                    )
                ),
                React.createElement("div", {"className": "spacing small"}),
                React.createElement(Dbm.react.interaction.drag.DraggableItem, {skipDraggable: true, moveMode: "last"},
                    React.createElement("div", {className: "append-drop-position centered-cell-holder"},
                        React.createElement("div", {})
                    )
                ),
                React.createElement("div", {"className": "spacing small"}),
                React.createElement("div", {"className": "flex-row"},
                    React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._create.bind(this))},
                        React.createElement("div", {"className": "action-button action-button-padding"},
                            "Add"
                        )
                    )
                )
            )
            
        )
    }
}