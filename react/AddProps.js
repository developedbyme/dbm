import React from "react";
import Dbm from "../index.js";

export default class AddProps extends Dbm.react.BaseObject {

	_construct() {
		super._construct();
		
		this._clonedElement = null;
	}
	
	_getMainElementProps() {
		//console.log("wprr/manipulation/ManipulationBaseObject::_getMainElementProps");
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
		
		let newProps = aProps;
		if(aChild && aChild.props && aChild.props.className) {
			newProps = {};
			for(let objectName in aProps) {
				newProps[objectName] = aProps[objectName];
			}
			if(aProps.className) {
				newProps.className = aProps.className + " " + aChild.props.className;
			} 
			else {
				newProps.className = aChild.props.className;
			}
		}
		
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
		//console.log("wprr/manipulation/ManipulationBaseObject::_cloneChildrenAndAddProps");
		
		let children = aChildren;
		
		if(children.length === 0) {
			return null;
		}
		else if(children.length === 1) {
			return this._performClone(children[0], this.props);
		}
		
		let returnArray = new Array();
		
		let mainElementProps = this.props;
		
		let currentArray = children;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			
			if(currentChild !== null) {
				let newChild = this._performClone(currentChild, mainElementProps);
				returnArray.push(newChild);
			}
		}
		
		let callArray = [Fragment, {}].concat(returnArray);
		return React.createElement.apply(React, callArray);
	}
	
	_renderClonedElement() {
		return this._cloneChildrenAndAddProps(this.getPropValue("children"));
	}
	
	_createClonedElement() {
		//console.log("wprr/manipulation/ManipulationBaseObject::_createClonedElement");
		
		this._clonedElement = this._renderClonedElement();
	}
	
	_renderMainElement() {
		this._createClonedElement();
		return this._clonedElement;
	}
}
