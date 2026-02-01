import React from "react";
import Dbm from "../index.js";

export default class AddProps extends Dbm.react.BaseObject {

	_construct() {
		super._construct();
		
		this._clonedElement = null;
	}
	
	_getMainElementProps() {
		let returnObject = {};

		for(let objectName in this.props) {
			if(objectName === "children") {
				//MENOTE: children should not be passed on
				continue;
			}
			returnObject[objectName] = this.props[objectName];
		}
		
		return returnObject;
	}
	
	_performCloneWithNewChildren(aChild, aProps, aChildren) {
		var callArray = [aChild, aProps];
		
		callArray = callArray.concat(aChildren);
		
		return React.cloneElement.apply(React, callArray);
	}
	
	_performClone(aChild, aProps) {
		//console.log("_cloneChildrenAndAddProps");
		
		if(aChild instanceof Array) {
			let returnArray = [];
			
			let currentArray = aChild;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentChild = currentArray[i];
				returnArray.push(this._performClone(currentChild, aProps));
			}
			
			return returnArray;
		}

		let newProps = this._copyProps(aChild.props);
		
		let callArray = [aChild, newProps];
		
		if(aChild && aChild.props) {
			let firstChildChildren = aChild.props.children;
			if(!firstChildChildren) {
				callArray.push(null);
			}
			else if(firstChildChildren instanceof Array) {
				callArray = callArray.concat(firstChildChildren);
			}
			else {
				callArray.push(firstChildChildren);
			}
		}
		
		return React.cloneElement.apply(React, callArray);
	}
	
	_cloneChildrenAndAddProps(aChildren) {
		//console.log("_cloneChildrenAndAddProps");
		
		let children = aChildren;
		
		if(children.length === 0) {
			return null;
		}
		
		let mainElementProps = this.props;
		
		if(children.length === 1) {
			return this._performClone(children[0], mainElementProps);
		}
		
		let returnArray = new Array();
		let currentArray = children;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			
			if(currentChild !== null) {
				let newChild = this._performClone(currentChild, mainElementProps);
				returnArray.push(newChild);
			}
		}
		
		let callArray = [React.Fragment, {}].concat(returnArray);
		return React.createElement.apply(React, callArray);
	}
	
	_renderClonedElement() {
		let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));
		return this._cloneChildrenAndAddProps(children);
	}
	
	_createClonedElement() {
		
		this._clonedElement = this._renderClonedElement();
	}
	
	_renderMainElement() {
		this._createClonedElement();
		return this._clonedElement;
	}
}
