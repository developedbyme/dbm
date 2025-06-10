import React from "react";
import Dbm from "../../../index.js";

export default class AskAQuestion extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("searchText", "");
        this.item.requireProperty("currentQuery", "");

        this.item.requireProperty("state", "start");

        this.item.requireProperty("results", []);

        let switchValue = Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.state);

        switchValue.addCase("start", React.createElement("div", null, React.createElement(Dbm.react.text.Link, {
            href: Dbm.react.source.blockData("url1"),
            className: "custom-styled-link"
          }, React.createElement("div", {
            className: "standard-row hover-row faq-row-padding"
          }, React.createElement("div", {
            className: "flex-row small-item-spacing"
          }, React.createElement("div", {
            className: "flex-row-item flex-resize"
          }, Dbm.react.text.text(Dbm.react.source.blockData("text1"))), React.createElement("div", {
            className: "flex-row-item flex-no-resize"
          }, React.createElement("div", {
            className: "spacing micro"
          }), React.createElement(Dbm.react.image.Image, {
            src: "/assets/img/right-arrow.svg",
            className: "right-arrow-link-icon background-contain"
          }))))), React.createElement(Dbm.react.text.Link, {
            href: Dbm.react.source.blockData("url2"),
            className: "custom-styled-link"
          }, React.createElement("div", {
            className: "standard-row hover-row faq-row-padding cursor-pointer"
          }, React.createElement("div", {
            className: "flex-row small-item-spacing"
          }, React.createElement("div", {
            className: "flex-row-item flex-resize"
          }, Dbm.react.text.text(Dbm.react.source.blockData("text2"))), React.createElement("div", {
            className: "flex-row-item flex-no-resize"
          }, React.createElement("div", {
            className: "spacing micro"
          }), React.createElement(Dbm.react.image.Image, {
            src: "/assets/img/right-arrow.svg",
            className: "right-arrow-link-icon background-contain"
          })))))));
        switchValue.addCase("loading", React.createElement("div", null, React.createElement("div", {
            className: "spacing small"
          }), "Loading..."));
        switchValue.addCase("results", React.createElement("div", null, React.createElement(Dbm.react.area.List, {
            items: this.item.properties.results
          }, React.createElement(Dbm.react.text.Link, {
            href: Dbm.react.source.contextVariable("item.link"),
            className: "custom-styled-link"
          }, React.createElement("div", {
            className: "standard-row hover-row faq-row-padding cursor-pointer"
          }, React.createElement("div", {
            className: "flex-row small-item-spacing"
          }, React.createElement("div", {
            className: "flex-row-item flex-resize"
          }, Dbm.react.text.text(Dbm.react.source.contextVariable("item.title"))), React.createElement("div", {
            className: "flex-row-item flex-no-resize"
          }, React.createElement("div", {
            className: "spacing micro"
          }), React.createElement(Dbm.react.image.Image, {
            src: "/assets/img/right-arrow.svg",
            className: "right-arrow-link-icon background-contain"
          }))))))));
        switchValue.addCase("noResults", React.createElement("div", {
            className: "faq-row-padding"
          }, "We could not find what you were looking for. Please contact us by phone or email instead."));

        this.item.requireProperty("resultElement", null).connectInput(switchValue.output.properties.value);
    }

    _dataLoaded(aQuery, aRequest) {
        //console.log("_dataLoaded");
        //console.log(aQuery, aRequest);

        if(aQuery === this.item.currentQuery) {
            let ids = Dbm.objectPath(aRequest, "data.answers");
            if(ids.length > 0) {
                let items = Dbm.getInstance().repository.getItems(ids);
                this.item.results = items;
                this.item.state = "results";
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
                  React.createElement("button", {className: "skip-default full-height"},
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