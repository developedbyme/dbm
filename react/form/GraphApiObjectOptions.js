import React from "react";
import Dbm from "../../index.js";

export default class GraphApiObjectOptions extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let valueProp = this.getDynamicProp("value", "");
        this.item.requireProperty("items", []);
        this.item.requireProperty("options", []);

        this._singelSelection = new Dbm.flow.controllers.select.SingleSelection();
        this._singelSelection.item.properties.value.connectInput(valueProp);

        let objectType = this.getPropValue("objectType");
        let encodings = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.getPropValueWithDefault("encoding", "name,identifier"), ",", true);

        {
            let request = Dbm.getGraphApi().requestRange(
                [
                    {"type": "byObjectType", "objectType": objectType},
                    {"type": "includeDraft"},
                    {"type": "includePrivate"}
                ],
                encodings
            );
            
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._itemsLoaded.bind(this), [request]));
        }
    }

    

    _itemsLoaded(aRequest) {

        let nameField = this.getPropValueWithDefault("nameField", "name");
        let identifierField = this.getPropValueWithDefault("identifierField", "identifier");
        let options = this.getPropValue("options");

        let currentArray = [].concat(aRequest.items);
        if(options) {
            currentArray = Dbm.utils.ArrayFunctions.filterByField(aRequest.items, identifierField, options, "inArray");

            let sortFunction = function(aA, aB) {

                let sortIndexA = options.indexOf(aA);
                if(sortIndexA === -1) {
                    sortIndexA = order.length;
                }

                let sortIndexB = options.indexOf(aB);
                if(sortIndexB === -1) {
                    sortIndexB = order.length;
                }
                
                return sortIndexA-sortIndexB;
            }

            Dbm.utils.ArrayFunctions.sortOnField(currentArray, identifierField, sortFunction);
        }
        else {
            Dbm.utils.ArrayFunctions.naturalSortOnField(currentArray, nameField);
        }

        this.item.items = currentArray;

        let rows = new Array();

        let children = this.getPropValue("children");
        if(!children) {
            children = React.createElement("span", {},
                React.createElement(Dbm.react.form.Checkbox, {"checked": Dbm.react.source.contextVariable("selected")}),
                Dbm.react.text.text(Dbm.react.source.item(nameField))
            );
        }
            
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            let currentRow = new Dbm.repository.Item();
            currentRow.setId("_dbmInternal/row" + currentItem.id);

            let property = this._singelSelection.addSelectionValue(currentItem.id);

            currentRow.setValue("item", currentItem);
            currentRow.setValue("element", React.createElement(Dbm.react.context.AddContextVariables, {"values": {"item": currentItem, "selected": property}}, children));
            rows.push(currentRow);
        }
        this.item.options = rows;
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value");

        return this._createMainElement("div", {}, 
            React.createElement(Dbm.react.area.List, {items: this.item.properties.options, as: "option"},
                React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.contextVariable("option.element")})
            )
        );
    }
}

