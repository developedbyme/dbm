import React from "react";
import Dbm from "../../../index.js";

export default class LinkListCard extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let mobileLayout = React.createElement(Dbm.react.text.Link, {"href": Dbm.core.source.first(Dbm.react.source.contextVariable("item.link"), Dbm.react.source.contextVariable("item.page.url")), "className": "custom-styled-link"},
          React.createElement("div", {"className": "standard-card standard-card-padding"},
            React.createElement(Dbm.react.image.WidthScaledImage, {image: Dbm.core.source.first(Dbm.react.source.contextVariable("item.image"), Dbm.react.source.contextVariable("item.page.image")), targetWidth: 300, className: "card-image-mobile background-cover"}),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("div", {},
              React.createElement("h3", {"className": "no-margins"},
                Dbm.react.text.text(Dbm.core.source.first(Dbm.react.source.contextVariable("item.title"), Dbm.react.source.contextVariable("item.page.title")))
              ),
              React.createElement("div", {"className": "body-text"},
                Dbm.react.text.htmlText(Dbm.react.source.contextVariable("item.description")),
              ),
              React.createElement("div", {"className": "flex-row justify-between"},
                React.createElement("div", {"className": "flex-row-item"}),
                React.createElement("div", {"className": "flex-row-item standard-card-read-more-link"},
                  React.createElement("div", {className: "flex-row micro-item-spacing vertically-center-items"},
                      React.createElement("div", {className: "flex-row-item flex-resize"},
                        Dbm.react.text.text(Dbm.react.source.blockData("buttonText"))
                      ),
                      React.createElement("div", {className: "flex-row-item flex-no-resize"},
                          React.createElement(Dbm.react.image.Image, {src: "/assets/img/read-more-right-arrow.svg", className: "right-arrow-read-more-link-icon background-contain"})
                      )
                  )
                )
              )
            )
          )
        );

        let desktopLayout = React.createElement(Dbm.react.text.Link, {"href": Dbm.core.source.first(Dbm.react.source.contextVariable("item.link"), Dbm.react.source.contextVariable("item.page.url")), "className": "custom-styled-link"},
          React.createElement("div", {"className": "standard-card standard-card-padding"}, 
          React.createElement("div", {"className": "flex-row small-item-spacing"},
            React.createElement("div", {"className": "flex-row-item flex-no-resize"},
              React.createElement(Dbm.react.image.WidthScaledImage, {image: Dbm.core.source.first(Dbm.react.source.contextVariable("item.image"), Dbm.react.source.contextVariable("item.page.image")), targetWidth: 200, className: "card-image-desktop background-cover"})
            ),
            React.createElement("div", {"className": "flex-row-item flex-resize"},
              React.createElement("h3", {"className": "no-margins"},
                Dbm.react.text.text(Dbm.core.source.first(Dbm.react.source.contextVariable("item.title"), Dbm.react.source.contextVariable("item.page.title")))
              ),
              React.createElement("div", {"className": "spacing small"}),
              React.createElement("div", {"className": "body-text"},
                Dbm.react.text.htmlText(Dbm.react.source.contextVariable("item.description")),
              ),
              
              React.createElement("div", {"className": "spacing small"}),
              React.createElement("div", {"className": "flex-row justify-between"},
                React.createElement("div", {"className": "flex-row-item"}),
                React.createElement("div", {"className": "flex-row-item standard-card-read-more-link"},
                  React.createElement("div", {className: "flex-row micro-item-spacing vertically-center-items"},
                    React.createElement("div", {className: "flex-row-item flex-resize"},
                      Dbm.react.text.text(Dbm.core.source.firstWithDefault(Dbm.react.source.contextVariable("item.linkText"), "Read more"))
                    ),
                    React.createElement("div", {className: "flex-row-item flex-no-resize"},
                        React.createElement(Dbm.react.image.Image, {src: "/assets/img/read-more-right-arrow.svg", className: "right-arrow-read-more-link-icon background-contain"})
                    )
                )
                )
              )
            )
          )
          )
        );

        
      
      

        this.responsiveLayout = Dbm.react.area.responsiveLayout(mobileLayout).addLayout(desktopLayout, 600);
    }

    _renderMainElement() {

        return React.createElement("div", {}, React.createElement("div", {
            ref: this.createRef("mainElement")
          }, this.responsiveLayout.mainElement));
    }
}