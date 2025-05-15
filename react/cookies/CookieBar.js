import React from "react";
import Dbm from "../../index.js";
import Cookies from "js-cookie";

export default class CookieBar extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let openProperty = this.getDynamicProp("open", false);
        this.item.requireProperty("envelope", 0);

        let stateToEnvelope = Dbm.flow.updatefunctions.logic.switchValue(openProperty).setDefaultValue(100).addCase(true, 0);
        let inDomCase = Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.envelope).setDefaultValue(true).addCase(100, false);

        this.item.requireProperty("inDom", false).connectInput(inDomCase.output.properties.value);

        let animation = new Dbm.flow.animateValue(stateToEnvelope.output.properties.value);
        
        this.item.properties.envelope.connectInput(animation.properties.output);

        let transform = new Dbm.flow.updatefunctions.dom.TransformStyle();
        transform.translateY(animation.properties.output, "%");

        let style = new Dbm.flow.updatefunctions.dom.StyleObject();
        style.addProperty("transform", transform.output.properties.value);
        this.item.requireProperty("style", null).connectInput(style.output.properties.style);

        let shouldShow = Cookies.get("cookie/hideCookieBar") !== "1";

        this.getDynamicProp("open").getMostUpstreamProperty().setValue(shouldShow);

        this.item.setValue("widthElement", null);

        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);

        elementSize.input.properties.element.connectInput(this.item.properties.widthElement);
        elementSize.start();

        let layoutSwitch = new Dbm.flow.updatefunctions.logic.RangeSwitch();
        layoutSwitch.input.properties.value.connectInput(elementSize.output.properties.width);

        layoutSwitch.input.defaultValue = React.createElement("div", {className: "cookie-bar cookie-bar-padding"},
            
            React.createElement("div", {},
                React.createElement("div", {"className": "cookie-bar-title"},
                    "Your privacy is important to us"
                ),
                React.createElement("div", {"className": "cookie-bar-description"},
                    "We use cookies to improve your experience on our site."
                )
            ),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("a", {"href": "/cookie-settings/", className:"custom-styled-link"},
                React.createElement("div", {"className": "secondary-button standard-button-padding text-align-center"}, "Settings")
            ),
        
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("div", {"className": "secondary-button standard-button-padding text-align-center", onClick: () => this._rejectAll()}, "Only necessary"),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("div", {"className": "standard-button standard-button-padding text-align-center",  onClick: () => this._acceptAll()}, "Allow all")
        
        );

        let tabletLayout = React.createElement("div", {className: "cookie-bar cookie-bar-padding"},
            
            React.createElement("div", {},
                React.createElement("div", {"className": "cookie-bar-title"},
                    "Your privacy is important to us"
                ),
                React.createElement("div", {"className": "cookie-bar-description"},
                    "We use cookies to improve your experience on our site."
                )
            ),
            React.createElement("div", {"className": "spacing small"}),
            
            React.createElement("div", {"className": "flex-row small-item-spacing"}, 
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement("a", {"href": "/cookie-settings/", className:"custom-styled-link"},
                        React.createElement("div", {"className": "secondary-button standard-button-padding"}, "Settings")
                    )
                ),
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement("div", {"className": "secondary-button standard-button-padding", onClick: () => this._rejectAll()}, "Only necessary")
                ),
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement("div", {"className": "standard-button standard-button-padding",  onClick: () => this._acceptAll()}, "Allow all")
                )
            )
        );

        layoutSwitch.addValueForRange(tabletLayout, 700, 1100);

        let desktopLayout = React.createElement("div", {className: "cookie-bar cookie-bar-padding"},
            React.createElement("div", {"className": "flex-row small-item-spacing justify-between"}, 
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement("div", {"className": "cookie-bar-title"},
                        "Your privacy is important to us"
                    ),
                    React.createElement("div", {"className": "cookie-bar-description"},
                        "We use cookies to improve your experience on our site."
                    )
                ),
                React.createElement("div", {"className": "flex-row-item"}, 
                    React.createElement("div", {"className": "flex-row small-item-spacing"}, 
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement("a", {"href": "/cookie-settings/", className:"custom-styled-link"},
                                React.createElement("div", {"className": "secondary-button standard-button-padding"}, "Settings")
                            )
                        ),
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement("div", {"className": "secondary-button standard-button-padding", onClick: () => this._rejectAll()}, "Only necessary")
                        ),
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement("div", {"className": "standard-button standard-button-padding",  onClick: () => this._acceptAll()}, "Allow all")
                        )
                    )
                )
            )
        );

        layoutSwitch.addValueForRange(desktopLayout, 1100);

        this.item.setValue("element", null);
        this.item.properties.element.connectInput(layoutSwitch.output.properties.value);
    }

    _acceptAll() {
        console.log("_acceptAll");

        let options = {"expires": 365};

        Cookies.set("cookie/allowPreferences", "1", options);
        Cookies.set("cookie/allowStatistics", "1", options);
        Cookies.set("cookie/allowMarketing", "1", options);
        Cookies.set("cookie/hideCookieBar", "1", options);

        let consentTime = (new Date()).toISOString();

        Cookies.set("cookie/consentTime", consentTime);

        Dbm.getInstance().repository.getItem("trackingController").allowStatistics = true;
        Dbm.getInstance().repository.getItem("trackingController").allowMarketing = true;

        this.getDynamicProp("open").getMostUpstreamProperty().setValue(false);
    }

    _rejectAll() {

        let options = {"expires": 365};

        Cookies.set("cookie/allowPreferences", "0", options);
        Cookies.set("cookie/allowStatistics", "0", options);
        Cookies.set("cookie/allowMarketing", "0", options);
        Cookies.set("cookie/hideCookieBar", "1", options);

        let consentTime = (new Date()).toISOString();

        Cookies.set("cookie/consentTime", consentTime);

        Dbm.getInstance().repository.getItem("trackingController").allowStatistics = false;
        Dbm.getInstance().repository.getItem("trackingController").allowMarketing = false;

        this.getDynamicProp("open").getMostUpstreamProperty().setValue(false);
    }

    _renderMainElement() {

        return this._createMainElement("div", {className: "cookie-bar-position no-pointer-events", ref: this.createRef("widthElement")},
            React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.inDom},
                React.createElement("div", {className: "overflow-hidden"},	
                    React.createElement(Dbm.react.BaseObject, {style: this.item.properties.style},
                        React.createElement("div", {className: "all-pointer-events"},
                            React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.element})
                        )
                    )
                )
            )
        );
    }
}

