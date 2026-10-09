import React from "react";
import Dbm from "../../index.js";

export default class LoadingArea extends Dbm.react.BaseObject {

    _construct() {
        let childrenProperty = this.getDynamicPropWithoutState("children", []);
        let statusProperty = this.getDynamicPropWithoutState("status", Dbm.loading.LoadingStatus.NOT_STARTED);

        let loadingText = this.getDynamicPropWithoutState("loadingText", null);
        let errorText = this.getDynamicPropWithoutState("errorText", null);
    }

    _constructAfterProps() {
        super._constructAfterProps();

        let childrenProperty = this.getDynamicPropWithoutState("children", []);
        let statusProperty = this.getDynamicPropWithoutState("status", Dbm.loading.LoadingStatus.NOT_STARTED);

        let loadingText = this.getDynamicPropWithoutState("loadingText", null);
        let errorText = this.getDynamicPropWithoutState("errorText", null);

        let elementProperty = this.item.requireProperty("element", null);

        let elementSwitch = Dbm.flow.updatefunctions.logic.switchValue(statusProperty);

        elementSwitch.setDefaultValue(React.createElement("div", {"key": "loading"}, Dbm.react.text.text(loadingText)));
        elementSwitch.addCase(Dbm.loading.LoadingStatus.ERROR, React.createElement("div", {"key": "error"}, Dbm.react.text.text(errorText)));
        elementSwitch.addCase(Dbm.loading.LoadingStatus.LOADED, React.createElement(Dbm.react.area.InsertElement, {"key": "loaded","element": childrenProperty}));

        this.item.setValue("elementSwitch", elementSwitch);

        elementProperty.connectInput(elementSwitch.output.properties.value);
    }

    _renderMainElement() {
        //console.log("HasData::render");
        //console.log(this);
        
        return React.createElement(Dbm.react.area.InsertElement, {"element": this.item.properties.element});
    }
}

