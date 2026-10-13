import React from "react";
import Dbm from "../../../index.js";

export default class CloseDateSelector extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicPropWithoutState("value", null);
        this.getDynamicPropWithoutState("editing", false);

    }

    _constructAfterProps() {
        super._constructAfterProps();

        let valueProp = this.getDynamicPropWithoutState("value");
        let editingProperty = this.getDynamicPropWithoutState("editing", false);

        this.item.requireProperty("displayText", false);
        this.item.requireProperty("open", false).addUpdate(this._getScopedCallFunctionCommand(this._openChanged));

        let displayText = Dbm.flow.updatefunctions.basic.transformValue(valueProp, this._updateDisplayText);
        this.item.properties.displayText.connectInput(displayText.output.properties.value);

        let selection = new Dbm.flow.controllers.select.SingleSelection();
        selection.item.properties.value.connectInput(valueProp);

        let locale = Dbm.repository.getItem("site").currentLanguageCode;

        let startDate = this.getPropValueWithDefault("startDate", new Date());
        let today = new Date(startDate);
        let currentWeekday = today.getDay();
        let firstDay = new Intl.Locale(locale).getWeekInfo().firstDay % 7;

        let startAt = Dbm.utils.NumberFunctions.floatMod(currentWeekday-firstDay+7, 7);

        let numberOfDays = this.getPropValueWithDefault("numberOfDays", 30);
        let stopAt = numberOfDays+startAt;
        let numberOfItems = 7*Math.ceil(stopAt/7);

        let rows = [];
        let currentRow = null;
        for(let i = 0; i < numberOfItems; i++) {
            if(i%7 === 0) {
                currentRow = [];
                rows.push({"id": rows.length, "items": currentRow});
            }
            if(i < startAt || i >= stopAt) {
                currentRow.push({"id": i, "element": React.createElement("div")});
            }
            else {
                let date = new Date(startDate);
                date.setDate(date.getDate() + i-startAt);

                let fullDate = date.toISOString().split("T")[0];
                let currentDate = date.getDate();
                let property = selection.addSelectionValue(fullDate);

                let element = React.createElement(Dbm.react.form.dateselector.CalendarDate, {selected: property, date: currentDate});

                if(currentDate === 1 || i === startAt) {

                    let monthLabel = React.createElement("div", {"className": "position-absolute date-selection-month-label-position full-width no-pointer-events"},
                        React.createElement("div", {"className": "flex-row justify-center"},
                            React.createElement("div", {"className": "date-selection-month-label date-selection-month-label-padding"},
                                React.createElement(Dbm.react.text.FormattedDate, {"date": fullDate, "format": {"month": "short"}})
                            )
                        )
                    )

                    element = React.createElement("div", {className: "absolute-container"}, element, monthLabel);
                }

                currentRow.push({"id": i, "element": element});
            }
        }

        this.item.setValue("rows", rows);

        let shortDays = Dbm.utils.TranslationFunctions.getLocaleWeekdays("short", locale);
        let mobileLayout = this._getDayHeaderFields(shortDays);

        let longDays = Dbm.utils.TranslationFunctions.getLocaleWeekdays("long", locale);
        let desktopLayout = this._getDayHeaderFields(longDays);


        this.responsiveLayout = Dbm.react.area.responsiveLayout(mobileLayout).addLayout(desktopLayout, 500);
    }

    _getDayHeaderFields(aDays) {

        let fields = new Array(7);

        let currentArray = aDays;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            fields[i] = React.createElement("div", {"key": i, "className": "quarter flex-resize"}, currentArray[i]); 
        }

        return React.createElement("div", {"className": "flex-row small-item-spacing small-description text-align-center"}, fields);
    }

    _toggleOpenClose() {
        let newState = !this.item.open;
        this.item.open = newState;
    }

    _openChanged() {
        this.item.properties["props/editing"].getMostUpstreamProperty().value = this.item.open;
    }

    _updateDisplayText(aDate) {

        if(!aDate) {
            return "Select date";
        }

        let selectedDate = new Date(aDate);
        let date = new Date();
        let fullDate = date.toISOString().split("T")[0];

        let locale = Dbm.repository.getItem("site").currentLanguageCode;
        let weekDays = Dbm.utils.TranslationFunctions.getLocaleWeekdays("long", locale);

        let dateDisplay =  Dbm.utils.TranslationFunctions.getLocaleDate(selectedDate, {year: "numeric", "month": "long", "day": "numeric"}, locale);

        if(fullDate === aDate) {
            let relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {numeric: "auto"});

            return relativeTimeFormat.format(0, "day") + ", " + dateDisplay;
        }

        date.setDate(date.getDate()+1);
        fullDate = date.toISOString().split("T")[0];

        if(fullDate === aDate) {
            let relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {numeric: "auto"});

            return relativeTimeFormat.format(1, "day") + ", " + dateDisplay;
        }

        dateDisplay =  Dbm.utils.TranslationFunctions.getLocaleDate(selectedDate, {year: "numeric", "weekday": "long", "month": "long", "day": "numeric"}, locale);
        return dateDisplay;
    }

    _renderMainElement() {
        return this._createMainElement("div", {className: "standard-field standard-field-padding"},
            
            React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._toggleOpenClose.bind(this))},
                Dbm.react.div("flex-row small-item-spacing vertically-center-items cursor-pointer",
                    Dbm.react.div("flex-resize", Dbm.react.text.text(this.item.properties.displayText)),
                    React.createElement("div", {"className": "flex-no-resize", role:"button", title: "Select date", tabIndex: 0},
                        React.createElement(Dbm.react.image.Image, {src: "/assets/img/icons/calendar.svg", className: "field-icon icon-color:action background-contain"})
                    )
                )
            ),
            
            React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: this.item.properties.open},
                Dbm.react.spacing("medium"),
                this.responsiveLayout.mainElement,
                Dbm.react.spacing("micro"),

                React.createElement(Dbm.react.area.List, {items: this.item.properties.rows},
                    Dbm.react.div("flex-row small-item-spacing",
                        React.createElement(Dbm.react.area.List, {items: Dbm.react.source.item("items")},
                            Dbm.react.div("quarter flex-resize",
                                React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.item("element")})
                            )
                        )
                    ),
                    React.createElement("div", {"data-slot": "spacing", "className": "spacing small"})
                )
            )
        );
    }
}