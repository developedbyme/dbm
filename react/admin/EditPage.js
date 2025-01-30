import React from "react";
import Dbm from "../../index.js";

export default class EditPage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let page = this.context.page;

        this.item.setValue("title", page.title);
        this.item.setValue("navigationName", page.navigationName);
        this.item.setValue("content", page.content);
        this.item.setValue("description", page["meta/description"]);
        this.item.setValue("url", page.url);

        //METODO: add editors
    }

    _save() {
        console.log("_save");

        let page = this.context.page;
        let id = page.id;
        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        console.log(this.item.content);
        console.log(this.item.content.blocks[1].data.text);

        graphApi.editItem(id, [
            {"type": "setField", "data": {"value": this.item.content, "field": "content"}},
            {"type": "setField", "data": {"value": this.item.title, "field": "title"}},
            {"type": "setField", "data": {"value": this.item.navigationName, "field": "navigationName"}},
            {"type": "setField", "data": {"value": this.item.description, "field": "meta/description"}},
			{"type": "setField", "data": {"value": (new Date()).toISOString(), "field": "lastModified"}},
            {"type": "setUrl", "data": {"value": this.item.url}}
        ], ["content", "title", "url", "meta/description"]);
    }

    _renderMainElement() {

        return React.createElement("div", {},
            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Page title"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.title, className: "standard-field standard-field-padding full-width page-title-form-field", placeholder: "Title"}),
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Navigation name"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.navigationName, className: "standard-field standard-field-padding full-width", placeholder: "Name showed in menues and breadcrumbs"}),
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Url"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.url, className: "standard-field standard-field-padding full-width", placeholder: "Url"}),
                ),
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                React.createElement("label", {className: "standard-field-label"},
                    "Seo description"
                ),
                React.createElement(Dbm.react.form.FormField, {"value": this.item.properties.description, className: "standard-field standard-field-padding full-width", placeholder: "Description"}),
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                React.createElement("label", {className: "standard-field-label"},
                    "Content"
                ),
                React.createElement("div", {},
                    React.createElement(Dbm.react.admin.editor.Editor, {"value": this.item.properties.content}),
                )
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {className: "flex-row justify-center"},
                React.createElement("div", {className: "flex-row-item"},
                    React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                        "Save"
                    )
                )
            )
        );
    }
}

