import React from "react";
import Dbm from "../../../index.js";

export default class AskAQuestion extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("searchText", "");
        this.item.requireProperty("currentQuery", "");

        this.item.requireProperty("state", "start");
        this.item.requireProperty("openSection", 0);

        this._singelSelection = new Dbm.flow.controllers.select.SingleSelection();
        this._singelSelection.item.properties.value.connectInput(this.item.properties.openSection);
        this._rowProperties = [];

        this.item.requireProperty("results", []);

        let switchValue = Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.state);

        switchValue.addCase("start", React.createElement("div", null));
        switchValue.addCase("loading", React.createElement("div", null, React.createElement("div", {className: "spacing small"}), "Loading..."));
        switchValue.addCase("results", React.createElement("div", null,
          React.createElement(Dbm.react.area.List, {items: this.item.properties.results, as: "row"},
            React.createElement(Dbm.react.context.AddItemToContext, {item: Dbm.react.source.contextVariable("row.item")},
              React.createElement(Dbm.react.area.InsertElement, {element: Dbm.react.source.contextVariable("row.element")})
            ),
            React.createElement("div", {"data-slot": "spacing", "className": "spacing small help-section-row-spacing"})
          )
        ));
        switchValue.addCase("noResults", React.createElement("div", {className: "faq-row-padding"}, "We could not find what you were looking for. Please contact us by phone or email instead."));

        this.item.requireProperty("resultElement", null).connectInput(switchValue.output.properties.value);

        let ids = this.context.blockData.initialSections;
        let graphApi = Dbm.getInstance().repository.getItem("cachedGraphApi").controller;
        {
            let request = graphApi.requestRange(
                [
                    {type: "idSelection", "ids": ids}
                ],
                ["helpSection"]
            );
            
            this.item.requireProperty("initialLoadStatus", 0);
            Dbm.flow.addUpdateCommandWhenMatched(this.item.properties.initialLoadStatus, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._initalDataLoaded.bind(this), [request]));
            this.item.properties.initialLoadStatus.connectInput(request.properties.status);
        }
    }

    _getOpenProperty(aIndex) {
      for(let i = this._rowProperties.length; i <= aIndex; i++) {
        this._rowProperties.push(this._singelSelection.addSelectionValue(i));
      }
      
      return this._rowProperties[aIndex];
    }

    _createRows(aItems) {
      let rows = new Array();
      let currentArray = aItems;
      let currentArrayLength = currentArray.length;
      for(let i = 0; i < currentArrayLength; i++) {
        let currentItem = currentArray[i];
        let currentRow = new Dbm.repository.Item();
        currentRow.setId("_dbmInternal/row" + Dbm.getInstance().getNextId());
        currentRow.setValue("item", currentItem);
        currentRow.setValue("element", React.createElement(Dbm.react.blocks.faq.HelpSectionRowItem, {"open": this._getOpenProperty(i), "startState": (i === 0 ? "open" : "close")}));
        rows.push(currentRow);
      }
      this.item.results = rows;
    }

    _initalDataLoaded(aRequest) {
      console.log("_initalDataLoaded")
      console.log(aRequest);

      if(aRequest.items.length) {
        this._createRows(aRequest.items);
        this.item.state = "results";
      }
      
    }

    _dataLoaded(aQuery, aRequest) {
        //console.log("_dataLoaded");
        //console.log(aQuery, aRequest);

        if(aQuery === this.item.currentQuery) {
            let ids = Dbm.objectPath(aRequest, "data.answers");
            if(ids.length > 0) {
                let items = Dbm.getInstance().repository.getItems(ids);
                this._createRows(items);
                this.item.state = "results";
                this.item.openSection = 0;
            }
            else {
                this.item.state = "noResults";
            }
        }
    }

    _search() {
        console.log("_search");

        this.item.state = "loading";

        let currentQuery = this.item.searchText;
        this.item.currentQuery = currentQuery;

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("question", {"value": currentQuery});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [currentQuery, request]));

    }

    _renderMainElement() {
        return React.createElement("div", {
            className: "content-narrow"
          }, React.createElement("form", {
            onSubmit: aEvent => {
              aEvent.preventDefault();
              this._search();
              return false;
            }
          },
          React.createElement("div", {className: "standard-field overflow-hidden"},
            React.createElement("div", {className: "flex-row small-item-spacing"},
              React.createElement("div", {className: "flex-row-item flex-resize"},
                React.createElement(Dbm.react.form.FormField, {className: "standard-field-padding-left-side full-width integrated-field", value: this.item.properties.searchText, placeholder: "Ask us anything"})
              ),
              React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement("div", {className: "submit-button-field-padding-right-side border-box-sizing full-height"},
                  React.createElement("button", {className: "skip-default full-height", "aria-label": "Search"},
                    React.createElement("div", {className: "field-submit-button field-submit-button-padding full-height", onClick: () => {this._search();}},
                      React.createElement("div", {className: "centered-cell-holder full-size"},
                        React.createElement(Dbm.react.image.Image, {src: "/assets/img/right-arrow.svg", className: "right-arrow-link-icon background-contain"})
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        React.createElement("div", {className: "spacing small"}),
        React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.resultElement})
      );
    }
}