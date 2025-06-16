import React from "react";
import Dbm from "../../../index.js";

export default class HelpSectionRowItem extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._toggleOpenCommand = Dbm.commands.callFunction(this._toggleOpen.bind(this));
    }

    _toggleOpen() {
        //console.log("_toggleOpen");
        let open = this.getDynamicProp("open");
        open.getMostUpstreamProperty().setValue(!open.value);
    }

    _renderMainElement() {

        let open = this.getDynamicProp("open");

        let linkText = "Read more";
        if(this.context.item.linkText) {
            linkText = this.context.item.linkText;
        }

        let answerElement = React.createElement("div", {className: "help-section-row-answer help-section-row-answer-padding"}, 
            React.createElement("div", {className: "help-section-row-answer-title"},
                Dbm.react.text.text(Dbm.react.source.contextVariable("item.title"))
            ),
            React.createElement("div", {className: "help-section-row-answer-description body-text"},
                Dbm.react.text.htmlText(Dbm.react.source.contextVariable("item.description"))
            ),
            React.createElement("div", {className: "flex-row justify-between"},
                React.createElement("div", {className: "flex-row-item"}),
                React.createElement("div", {className: "flex-row-item flex-no-resize help-section-row-read-more-link"},
                    React.createElement("div", {className: "flex-row micro-item-spacing vertically-center-items"},
                        React.createElement("div", {className: "flex-row-item flex-resize"},
                            linkText
                        ),
                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                            React.createElement(Dbm.react.image.Image, {src: "/assets/img/read-more-right-arrow.svg", className: "right-arrow-read-more-link-icon background-contain"})
                        )
                    )
                )
            )
        );

        let link = Dbm.objectPath(this.context.item, "page.url");
        if(!link) {
            link = Dbm.objectPath(this.context.item, "link");
        }

        if(link) {
            answerElement = React.createElement(Dbm.react.text.Link, {"href": link, "className": "custom-styled-link"}, answerElement);
        }

        return React.createElement("div", {className: "help-section-row help-section-row-padding"},
            React.createElement(Dbm.react.interaction.CommandButton, {command: this._toggleOpenCommand}, 
                React.createElement("div", {className: "help-section-row-question help-section-row-question-padding cursor-pointer"}, 
                    React.createElement("div", {className: "flex-row small-item-spacing vertically-center-items"},
                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                            React.createElement(Dbm.react.image.Image, {src: "/assets/img/faq-question.svg", className: "help-section-row-question-icon background-contain"})
                        ),
                        React.createElement("div", {className: "flex-row-item flex-resize"},
                            Dbm.react.text.text(Dbm.react.source.contextVariable("item.question"))
                        ),
                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                            React.createElement(Dbm.react.area.HasData, {check: open}, "-"),
                            React.createElement(Dbm.react.area.HasData, {check: open, checkType: "invert/default"}, "+"),
                        )
                    )
                )
            ),
            React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: open}, 
                answerElement
            )
        );
    }
}