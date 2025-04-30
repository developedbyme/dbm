import Dbm from "../../../index.js";

export default class PoisitonedItems extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("elementWidth", 0);
        this.input.register("itemWidth", 0);
        this.input.register("itemSpacing", 0);
        this.input.register("padding", 0);
        this.input.register("numberOfItems", 0);

        this.output.register("startPosition", 0);
        this.output.register("parameterLength", 0);

        this.output.register("minParameter", 0);
        this.output.register("maxParameter", 0);

        /*
        let parameter = minParameter;

        let x = padding+startPosition-parameter*parameterLength;

        console.log(minParameter, maxParameter, fullWidth, startPosition);
        console.log(x);

        parameter = maxParameter;

        x = padding+startPosition-parameter*parameterLength;

        console.log(x);
        */
    }

    _update() {
        //console.log("_update");

        let elementWidth = this.input.elementWidth;
        let itemWidth = this.input.itemWidth;
        let itemSpacing = this.input.itemSpacing;
        let padding = this.input.padding;

        let visualWidth = elementWidth-2*padding;
        let startPosition = (visualWidth-itemWidth)/2;

        let parameterLength = itemWidth+itemSpacing;
        let fullWidth = this.input.numberOfItems*parameterLength-itemSpacing;

        let minParameter = 0;
        let maxParameter = 0;

        if(fullWidth > visualWidth) {
            minParameter = startPosition/parameterLength;
            maxParameter = (fullWidth-(visualWidth-startPosition))/parameterLength;
        }
        else {
            startPosition = (visualWidth-fullWidth)/2;
            parameterLength = 0;
        }

        this.output.startPosition = startPosition;
        this.output.parameterLength = parameterLength;

        this.output.minParameter = minParameter;
        this.output.maxParameter = maxParameter;
    }
}