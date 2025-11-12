import Dbm from "../../../index.js";

export default class ElementPosition extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("element", null);
		this.input.register("prepareX", 0);
		this.input.register("prepareY", 0);
		
		this.output.register("screenX", NaN);
		this.output.register("screenY", NaN);

		this.output.register("pageX", NaN);
		this.output.register("pageY", NaN);

		this.output.register("parameterX", NaN);
		this.output.register("parameterY", NaN);
		
		this.output.register("visible", false);
		this.output.register("prepare", false);

        this._callback_scrollBound = this._callback_scroll.bind(this);
    }

    start() {
		//console.log("start");
		window.addEventListener("resize", this._callback_scrollBound, false);
		window.addEventListener("scroll", this._callback_scrollBound, false);
		this.output.properties.prepare.startUpdating();

        return this;
    }

    _update() {
        //console.log("_update");

        let element = this.input.element;

        if(element) {
			
            //this.output.width = element.clientWidth;
            //this.output.height = element.clientHeight;
			
			//let thePageXOffset = window.pageXOffset;
			let theInnerWidth = window.innerWidth;
			//let thePageYOffset = window.pageYOffset;
			let theInnerHeight = window.innerHeight;
			
			//console.log(theInnerWidth, theInnerHeight);
			
			let rect = element.getBoundingClientRect();
			
			let prepareX = this.input.prepareX;
			let prepareY = this.input.prepareY;
			
			let screenX = rect.x;
			let screenY = rect.y;
			
			let elementWidth = rect.width;
			let elementHeight = rect.height;
			
			let visible = ((screenX < theInnerWidth) && (screenX+elementWidth > 0)) && ((screenY < theInnerHeight) && (screenY+elementHeight > 0));
			let prepare = ((screenX-prepareX < theInnerWidth) && (screenX+elementWidth+prepareX > 0)) && ((screenY-prepareY < theInnerHeight) && (screenY+elementHeight+prepareY > 0));
			
			let parameterX = (screenX+elementWidth)/(theInnerWidth+elementWidth);
			let parameterY = (screenY+elementHeight)/(theInnerHeight+elementHeight);
			
			this.output.screenX = screenX;
			this.output.screenY = screenY;

			this.output.pageX = screenX-window.scrollX;
			this.output.pageY = screenY-window.scrollY;
			
			this.output.parameterX = parameterX;
			this.output.parameterY = parameterY;
			
			this.output.visible = visible;
			this.output.prepare = prepare;

        }
        else {
            //this.output.width = 0;
            //this.output.height = 0;
			
			//METODO
        }
    }

    _callback_scroll(aEvent) {
        //console.log("_callback_scroll");

        let element = this.input.element;

        if(element) {
			
			//let thePageXOffset = window.pageXOffset;
			let theInnerWidth = window.innerWidth;
			//let thePageYOffset = window.pageYOffset;
			let theInnerHeight = window.innerHeight;
			
			//console.log(theInnerWidth, theInnerHeight);
			
			let rect = element.getBoundingClientRect();
			//console.log(rect);
			
			let prepareX = this.input.prepareX;
			let prepareY = this.input.prepareY;
			
			let screenX = rect.x;
			let screenY = rect.y;
			
			let elementWidth = rect.width;
			let elementHeight = rect.height;
			
			let visible = ((screenX < theInnerWidth) && (screenX+elementWidth > 0)) && ((screenY < theInnerHeight) && (screenY+elementHeight > 0));
			let prepare = ((screenX-prepareX < theInnerWidth) && (screenX+elementWidth+prepareX > 0)) && ((screenY-prepareY < theInnerHeight) && (screenY+elementHeight+prepareY > 0));
			
			let parameterX = (screenX+elementWidth)/(theInnerWidth+elementWidth);
			let parameterY = (screenY+elementHeight)/(theInnerHeight+elementHeight);
			
			this.output.properties.screenX._internal_setValueInFlowOutsideOfUpdate(screenX);
			this.output.properties.screenY._internal_setValueInFlowOutsideOfUpdate(screenY);

			this.output.properties.pageX._internal_setValueInFlowOutsideOfUpdate(screenX+window.scrollX);
			this.output.properties.pageY._internal_setValueInFlowOutsideOfUpdate(screenY+window.scrollY);
			
			this.output.properties.parameterX._internal_setValueInFlowOutsideOfUpdate(parameterX);
			this.output.properties.parameterY._internal_setValueInFlowOutsideOfUpdate(parameterY);
			
			this.output.properties.visible._internal_setValueInFlowOutsideOfUpdate(visible);
			this.output.properties.prepare._internal_setValueInFlowOutsideOfUpdate(prepare);
        }
    }
}