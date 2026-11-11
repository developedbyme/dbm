import React from "react";
import Dbm from "../../index.js";

export default class LimitedList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let moreItems = new Dbm.repository.Item();
        moreItems.setId("moreItems");

        moreItems.setValue("numberOfItems", 0);
        this.item.setValue("moreItems", moreItems);
    }

    _renderMainElement() {

        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));
        
        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);
                
        
        let mainChildren = slots.main;

        let spacingElement = slots["spacing"] ? slots["spacing"] : React.createElement("span", {"className": "limited-list-separator"}, ", ");
        let lastSpacingElement = slots["lastSpacing"] ? slots["lastSpacing"] : React.createElement("span", {"key": "lastSpacing", "className": "limited-list-last-separator"}, " and ");
        let moreItemsElement = slots["moreItems"] ? slots["moreItems"] : React.createElement("span", {"key": "moreItems", "className": "more items"}, Dbm.react.text.sourced.fromContext("item.properties.numberOfItems"), " more items");

        let items = [...this.getPropValueWithDefault("items", [])];
        let maxNumberOfItems = this.getPropValueWithDefault("maxNumberOfItems", 7);

        let returnElement = null;

        if(items.length > maxNumberOfItems) {

            let numberOfVisibleItems = maxNumberOfItems-1;
            let firstItems = items.slice(0, numberOfVisibleItems);

            this.item.moreItems.numberOfItems = items.length-numberOfVisibleItems;
            console.log(items.length, numberOfVisibleItems, this.item.moreItems.numberOfItems);

            returnElement = React.createElement(React.Fragment, {}, 
                React.createElement(Dbm.react.area.List, {items: firstItems},
                    mainChildren,
                    React.createElement(Dbm.react.AddProps, {"data-slot": "spacing"}, spacingElement)
                ),
                lastSpacingElement,
                React.createElement(Dbm.react.context.AddItemToContext, {"item": this.item.moreItems},
                    moreItemsElement
                )
            );
        }
        else if(items.length > 1) {
            let lastItem = items.pop();

            returnElement = React.createElement(React.Fragment, {}, 
                React.createElement(Dbm.react.area.List, {items: items},
                    mainChildren,
                    React.createElement(Dbm.react.AddProps, {"data-slot": "spacing"}, spacingElement)
                ),
                lastSpacingElement,
                React.createElement(Dbm.react.context.AddItemToContext, {"item": lastItem},
                    mainChildren
                )
            );
        }
        else {
            returnElement = React.createElement(React.Fragment, {}, 
                React.createElement(Dbm.react.area.List, {items: items},
                    mainChildren,
                    React.createElement(Dbm.react.AddProps, {"data-slot": "spacing"}, spacingElement)
                )
            );
        }
        

        return returnElement;
    }
}

