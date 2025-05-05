import React from "react";
import Dbm from "../../index.js";

export default class List extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {
        //console.log("List::_renderMainElement");
        //console.log(this);
        
        let items = this.getPropValue("items");
        let children = this.getPropValue("children");
        let keyField = this.getPropValue("keyField");
        if(!keyField) {
            keyField = "id";
        }
        let as = this.getPropValue("as");
        if(!as) {
            as = "item";
        }
        
        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);

        let spacingElement = slots.spacing;
        let mainChildren = slots.main;

        let currentArray = items;
        if(!currentArray || isNaN(currentArray.length)) {
            console.error("Items is not an array", this);
            return null;
        }
        let currentArrayLength = currentArray.length;
        let newChildren = [];
        for(let i = 0; i < currentArrayLength; i++) {
            if(spacingElement && i > 0) {
                newChildren.push(React.createElement(React.Fragment, {key: "spacing" + (i-1)}, spacingElement));
            }
            let currentItem = currentArray[i];
            let values = {};
            values[as] = currentItem;
            let key = Dbm.objectPath(currentItem, keyField);
            newChildren.push(React.createElement(Dbm.react.context.AddContextVariables, {key: key, values: values}, mainChildren));
        }

        return React.createElement(React.Fragment, {}, newChildren);
    }
}

