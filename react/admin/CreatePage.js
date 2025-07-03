import React from "react";
import Dbm from "../../index.js";

export default class CreatePage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("title", "");
        this.item.requireProperty("url", "");
        this.item.requireProperty("freeUrl", "");
        this.item.requireProperty("updateSlugFromTitle", true);

        this._titleFieldId = "dbmField" + Dbm.getInstance().getNextId();
        this._urlFieldId = "dbmField" + Dbm.getInstance().getNextId();

        Dbm.flow.addUpdateCommand(this.item.properties.title, Dbm.commands.callFunction(this._titleChanged.bind(this)));
        Dbm.flow.addUpdateCommand(this.item.properties.url, Dbm.commands.callFunction(this._urlChanged.bind(this)));
    }

    _titleChanged() {
        console.log("_titleChanged");
        console.log(this.item.updateSlugFromTitle);

        if(this.item.updateSlugFromTitle) {
            this.item.url = Dbm.utils.StringFunctions.createNiceFilePath(this.item.title);
        }
        
    }

    _urlChanged() {
        console.log("_urlChanged");

        let currentUrl = this.item.url;

        if(currentUrl !== "") {
            let request = Dbm.getInstance().repository.getItem("graphApi").controller.requestData("admin/freeUrl", {"url": "/" + currentUrl});

            Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._freeUrlStatusChanged.bind(this), [currentUrl, request]));
        }
        else {
            currentUrl = Dbm.utils.StringFunctions.createNiceFilePath(this.item.title);
            let request = Dbm.getInstance().repository.getItem("graphApi").controller.requestData("admin/freeUrl", {"url": "/" + currentUrl});

            Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._freeUrlStatusChanged.bind(this), [currentUrl, request]));

            this.item.updateSlugFromTitle = true;
        }
    }

    _freeUrlStatusChanged(aUrl, aRequest) {
        console.log("_freeUrlStatusChanged");
        if(aRequest.status === 1) {
            let currentUrl = this.item.url;
            if(!currentUrl) {
                currentUrl = Dbm.utils.StringFunctions.createNiceFilePath(this.item.title);
                this.item.url = currentUrl;
            }
            if(currentUrl === aUrl) {
                this.item.freeUrl = aRequest.data.url;
            }
        }
    }

    _callback_urlUpdatedManually(aEvent) {
        this.item.updateSlugFromTitle = false;
    }

    _create() {
        console.log("_create");

        let fullUrl = this.item.freeUrl + "/";

        let currentDate = (new Date()).toISOString().split("T")[0];

        let changes = [
            {"type": "setField", "data": {"value": this.item.title, "field": "title"}},
            {"type": "setField", "data": {"value": currentDate, "field": "publishDate"}},
            {"type": "setUrl", "data": {"value": fullUrl}}
        ]

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem(["page"], "public", changes);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._pageCreated.bind(this), [fullUrl]));
    }

    _pageCreated(aUrl) {
        Dbm.getInstance().repository.getItem("siteNavigation").controller.navigate(aUrl);
    }

    _renderMainElement() {

        let domain = document.location.protocol + "//" + document.location.host;

        return React.createElement("div", {},
            React.createElement("div", {},
                React.createElement("label", {className: "standard-field-label"},
                    "Page title"
                ),
                React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.title, "id": this._titleFieldId, className: "standard-field standard-field-padding full-width"}),
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {},
                React.createElement("label", {className: "standard-field-label"},
                    "Url"
                ),
                React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.url, "id": this._urlFieldId, onFocus: this._callback_urlUpdatedManually.bind(this), className: "standard-field standard-field-padding full-width"}),
            ),
            React.createElement("div", {className: "spacing micro"}),
            React.createElement("div", {"className": "small-description"},
                Dbm.react.text.text(domain),
                Dbm.react.text.text(this.item.properties.freeUrl),
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {className: "flex-row justify-center"},
                React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._create()}},
                    "Create"
                )
            )
        );
    }
}

