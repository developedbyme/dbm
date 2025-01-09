import React from "react";
import Dbm from "../../index.js";
import Cookies from "js-cookie";

export default class CookieSettings extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let settings = [];

        {
            let currentItem = this._createSetting("cookie/allowPreferences", "Preferences cookies", "These cookies allow a website to remember choices you have made in the past.");
            settings.push(currentItem);
        }

        {
            let currentItem = this._createSetting("cookie/allowStatistics", "Statistics cookies", "These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions.");
            settings.push(currentItem);
        }

        {
            let currentItem = this._createSetting("cookie/allowMarketing", "Marketing cookies", "These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.");
            settings.push(currentItem);
        }

        {
            let currentItem = this._createSetting("cookie/hideCookieBar", "Hide cookie information when websites load", "Hides the cookie information and links that is displayed every time the website is loaded.");
            settings.push(currentItem);
        }

        this.item.setValue("settings", settings);

        this.item.setValue("consentTime", Cookies.get("cookie/consentTime"));
    }

    _createSetting(aName, aTitle, aDescription) {
        let currentItem = new Dbm.repository.Item();

        let fieldName = "field" + Dbm.getInstance().getNextId();
            
        currentItem.setValue("name", aName);

        let currentValue = Cookies.get(aName) === "1";
        currentItem.setValue("value", currentValue);
        
        let element = React.createElement("div", {"className": "flex-row small-item-spacing", "key": aName}, 
            React.createElement("div", {"className": "flex-row-item"},
                React.createElement(Dbm.react.form.Checkbox, {"type": "checkbox", "checked": currentItem.properties.value, "id": fieldName})
            ),
            React.createElement("div", {"className": "flex-row-item"},
                React.createElement("label", {"htmlFor": fieldName}, 
                    React.createElement("div", {"className": "cookie-settings-title"}, aTitle),
                    React.createElement("div", {"className": "small-description cookie-description"}, aDescription)
                ),
            )
        );
        currentItem.setValue("element", element);

        return currentItem;
    }

    _save() {
        console.log("_save");

        let settings = this.item.settings;
        let options = {"expires": 365};

        let currentArray = settings;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentSetting = currentArray[i];
            let checked = currentSetting.value;
            let name = currentSetting.name;
            
            Cookies.set(name, checked ? "1" : "0", options);

            if(name === "cookie/allowStatistics") {
                console.log(Dbm.getInstance().repository.getItem("trackingController"));
                Dbm.getInstance().repository.getItem("trackingController").allowStatistics = checked;
            }
            else if(name === "cookie/allowMarketing") {
                Dbm.getInstance().repository.getItem("trackingController").allowMarketing = checked;
            }
        }
        
        let consentTime = (new Date()).toISOString();

        Cookies.set("cookie/consentTime", consentTime)
        this.item.setValue("consentTime", consentTime, options);
    }

    _renderMainElement() {

        let elements = this.item.settings.map((aSetting) => {
            return aSetting.element;
        })

        return this._createMainElement("div", {"className": "content-narrow"}, 
            React.createElement("div", {className: "body-text"},
                React.createElement("div", {"className": "flex-row small-item-spacing"}, 
                    React.createElement("div", {"className": "flex-row-item"},
                        React.createElement("input", {"type": "checkbox", "checked": true, "disabled": true})
                    ),
                    React.createElement("div", {"className": "flex-row-item"}, 
                        React.createElement("div", {"className": "cookie-settings-title"}, "Strictly necessary cookies"),
                        React.createElement("div", {"className": "small-description cookie-description"}, "These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.")
                    )
                ),
                elements
            ),
            React.createElement("div", {"className": "spacing standard"}),
            React.createElement("div", {"className": "flex-row justify-center"}, 
                React.createElement("div", {"className": "standard-button standard-button-padding", onClick: () => this._save()}, "Save")
            )
        );
    }
}

