import Dbm from "../index.js";
import {Tween, Easing} from '@tweenjs/tween.js';

export default class PropertyUpdater extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._currentTweens = new WeakMap();

        this.item.setValue("tweens", []);
        this.item.setValue("updatedProperties", []);
        this.item.setValue("singleUpdateProperties", []);
        this.item.setValue("running", false);
        this.item.setValue("timer", 0);

        this._updateBound = this._update.bind(this);
        this.addSinglePropertyUpdateBound = this.addSinglePropertyUpdate.bind(this);
    }

    setTimer(aTimerItem) {
        aTimerItem.update = this._updateBound;
        this.item.timer = aTimerItem;

        return this;
    }

    _update(aTime) {
        //console.log("_update");
        {
            let currentArray = this.item.tweens;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentTween = currentArray[i];
                currentTween.update();
            }
        }
        {
            let currentArray = this.item.updatedProperties;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentProperty = currentArray[i];
                if(currentProperty.isDirty) {
                    //console.log(currentProperty);
                    currentProperty.updateFlow();
                }
            }
        }

        {
            let currentArray = this.item.singleUpdateProperties;
            let currentArrayLength = currentArray.length;
            if(currentArrayLength) {
                this.item.singleUpdateProperties = [];
                for(let i = 0; i < currentArrayLength; i++) {
                    let currentProperty = currentArray[i];
                    if(currentProperty.isDirty) {
                        currentProperty.updateFlow();
                    }
                }
            }
            
        }
    }

    start() {
        this.item.timer.controller.start();

        return this;
    }

    stop() {
        this.item.timer.controller.start();
        
        return this;
    }

    addProperty(aProperty) {

        let updatedProperties = [].concat(this.item.updatedProperties);
        updatedProperties.push(aProperty);
        this.item.updatedProperties = updatedProperties;

        return this;
    }

    removeProperty(aProperty) {

        let updatedProperties = [].concat(this.item.updatedProperties);
        let index = updatedProperties.indexOf(aProperty);

        if(index >= 0) {
            updatedProperties.splice(index, 1);
        }
        
        this.item.updatedProperties = updatedProperties;

        return this;
    }

    animateProperty(aProperty, aToValue, aTime, aDelay = 0, aEasing = null) {

        if(this._currentTweens.has(aProperty)) {
            this._currentTweens.get(aProperty).stop();
        }


        let tweenObject = {"envelope": aProperty.value};
        if(!aEasing) {
            aEasing = Easing.Quadratic.Out;
        }
        let tween = new Tween(tweenObject).to({"envelope": aToValue}, 1000*aTime).delay(1000*aDelay).easing(aEasing).onUpdate(function(aData) {aProperty.value = aData.envelope}).onComplete(() => {this.removeTween(tween)}).start();

        let tweens = [].concat(this.item.tweens);
        tweens.push(tween);
        this.item.tweens = tweens;

        this._currentTweens.set(aProperty, tween);

        return this;
    }

    removeTween(aTween) {
        //console.log("removeTween");
        //METODO
    }

    addSinglePropertyUpdate(aProperty) {
        //console.log("addSinglePropertyUpdate");
        //console.log(aProperty);

        let updatedProperties = [].concat(this.item.singleUpdateProperties);
        updatedProperties.push(aProperty);
        this.item.singleUpdateProperties = updatedProperties;

        return this;
    }
}