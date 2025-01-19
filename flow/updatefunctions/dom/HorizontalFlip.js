import Dbm from "../../../index.js";

export default class HorizontalFlip extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("envelope", 0);
        this.input.register("perspective", "3000px");

        this.output.register("style1", {});
        this.output.register("style2", {"opacity": 0, "position": "absolute", "top": 0, "left": 0, "width": "100%", "dispaly": "none"});
        this.output.register("inDom1", true);
        this.output.register("inDom2", false);
    }

    _update() {
        //console.log("_update");

        let envelope = this.input.envelope;
        let perspective = this.input.perspective;

        let inDom1 = (Math.round(Math.abs(180*envelope)+180)%360 !== 0);
        let inDom2 = (Math.round(Math.abs(180*envelope))%360 !== 0);

        this.output.inDom1 = inDom1;
        this.output.inDom2 = inDom2;

        if(!inDom1) {
            this.output.style1 = {"opacity": 0, "position": "absolute", "top": 0, "left": 0, "width": "100%", "dispaly": "none"};
            this.output.style2 = {};
        }
        else if(!inDom2) {
            this.output.style1 = {};
            this.output.style2 = {"opacity": 0, "position": "absolute", "top": 0, "left": 0, "width": "100%", "dispaly": "none"};
        }
        else {
            let angle1 = 180*envelope;
            let angle2 = angle1-180;
            let localAngle = Dbm.utils.NumberFunctions.floatMod(angle1, 360);
    
            let styleObject1 = {"transform": "perspective(" + perspective + ") rotateY(" + angle1 + "deg)"};
            let styleObject2 = {"transform": "perspective(" + perspective + ") rotateY(" + angle2 + "deg)"};
            
            if(localAngle < 90 || localAngle >= 3*90) {
                styleObject1["opacity"] = 1;
                styleObject2["opacity"] = 0;
                styleObject2["position"] = "absolute";
                styleObject2["top"] = 0;
                styleObject2["left"] = 0;
                styleObject2["width"] = 0;
            }
            else {
                styleObject1["opacity"] = 0;
                styleObject2["opacity"] = 1;
                styleObject1["position"] = "absolute";
                styleObject1["top"] = 0;
                styleObject1["left"] = 0;
                styleObject1["width"] = 0;
            }

            this.output.style1 = styleObject1;
            this.output.style2 = styleObject2;
        }
    }
}