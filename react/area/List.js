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

        let currentArray = items;
        let currentArrayLength = currentArray.length;
        let newChildren = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            let values = {};
            values[as] = currentItem;
            let key = Dbm.objectPath(currentItem, keyField);
            newChildren[i] = React.createElement(Dbm.react.context.AddContextVariables, {key: key, values: values}, children);
        }

        return React.createElement(React.Fragment, {}, newChildren);
    }
}

