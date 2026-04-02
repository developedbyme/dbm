import React from "react";
import Dbm from "../../index.js";

export default class GraphApiObjectSelection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");
        this.item.requireProperty("items", []);
        this.item.requireProperty("sortedItems", []);

        let objectType = this.getPropValue("objectType");
        let encodings = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.getPropValueWithDefault("encoding", "name"), ",", true);

        {
            let selects = [
                    {"type": "byObjectType", "objectType": objectType},
                    {"type": "includeDraft"},
                    {"type": "includePrivate"}
                ];
            if(this.getPropValue("anyStatus")) {
                selects = [
                    {"type": "byObjectType", "objectType": objectType},
                    {"type": "includeAnyStatus"}
                ];
            }

            let request = Dbm.getCachedGraphApi().requestRange(
                selects,
                encodings
            );

            this.item.properties.items.connectInput(request.properties.items);

            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._itemsLoaded.bind(this), [request]));
        }
    }

    _itemsLoaded(aRequest) {

        let nameField = this.getPropValueWithDefault("nameField", "name");

        let currentArray = [].concat(aRequest.items);
        Dbm.utils.ArrayFunctions.naturalSortOnField(currentArray, nameField);

        this.item.sortedItems = currentArray;
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value");
        let nameField = this.getPropValueWithDefault("nameField", "name");

        return this._createMainElement(Dbm.react.form.CustomSelection, {"value": value, "items": this.item.properties.sortedItems, "path": nameField},

    React.createElement("div", {
    "data-slot": "button",
    children: [React.createElement(Dbm.react.area.HasData, {
      check: Dbm.react.source.contextVariable("value"),
      children: React.createElement(Dbm.react.context.AddItemToContext, {
        item: Dbm.react.source.contextVariable("selectedItem"),
        children: [React.createElement(Dbm.react.area.HasData, {
          check: Dbm.react.source.item(),
          children: React.createElement("div", {
            children: Dbm.react.text.text(Dbm.react.source.item("name"))
          })
        }), React.createElement(Dbm.react.area.HasData, {
          check: Dbm.react.source.item(),
          checkType: "invert/default",
          children: React.createElement("div", {
            children: Dbm.react.text.text(Dbm.react.source.contextVariable("value"))
          })
        })]
      })
    }), React.createElement(Dbm.react.area.HasData, {
      check: Dbm.react.source.contextVariable("value"),
      checkType: "invert/default",
      children: React.createElement("div", {
        children: Dbm.react.text.translatedText("Select")
      })
    })]
  }), React.createElement("div", {
    children: React.createElement(Dbm.react.area.HasData, {
      check: Dbm.react.source.contextVariable("isVisible"),
      children: React.createElement(Dbm.react.area.List, {
        items: Dbm.react.source.contextVariable("rows"),
        as: "row",
        children: React.createElement(Dbm.react.context.AddItemToContext, {
          item: Dbm.react.source.contextVariable("row.forItem"),
          children: React.createElement(Dbm.react.interaction.CommandButton, {
            commands: [Dbm.commands.setProperty(Dbm.react.source.contextVariable("row.properties.selected"), true), Dbm.react.source.contextVariable("closeCommand")],
            children: React.createElement("div", {
              children: Dbm.react.text.text(Dbm.react.source.item("name"))
            })
          })
        })
      })
    })
  })


        );
    }
}

