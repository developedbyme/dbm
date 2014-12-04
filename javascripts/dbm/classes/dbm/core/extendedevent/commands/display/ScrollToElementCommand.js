/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.display.ScrollToElementCommand", "dbm.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.display.ScrollToElementCommand");
	
	var ScrollToElementCommand = dbm.importClass("dbm.core.extendedevent.commands.display.ScrollToElementCommand");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	var PositionFunctions = dbm.importClass("dbm.utils.htmldom.PositionFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.display.ScrollToElementCommand::_init");
		
		this.superCall();
		
		this.elementReevaluator = null;
		this.scrollerElementReevaluator = null;
		this.timeReevaluator = null;
		
		this._tempPoint = Point.create();
		this.addDestroyableObject(this._tempPoint);
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.commands.display.ScrollToElementCommand::perform");
		//console.log(aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		var theScrollerElement = this.scrollerElementReevaluator.reevaluate(aEventDataObject);
		var time = this.timeReevaluator.reevaluate(aEventDataObject);
		
		PositionFunctions.getParentPositionForNode(theElement, theScrollerElement, this._tempPoint);
		
		theScrollerElement.scrollTop = this._tempPoint.y;
		
		//console.log(theScrollerElement, theScrollerElement.scrollTop);
		
		//dbm.singletons.dbmAnimationManager.animateVariable(theScrollerElement, "scrollTop", this._tempPoint.y, 0.5, "linear", 0);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.elementReevaluator);
		ClassReference.softDestroyIfExists(this.scrollerElementReevaluator);
		ClassReference.softDestroyIfExists(this.timeReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.elementReevaluator = null;
		this.scrollerElementReevaluator = null;
		this.timeReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aElement, aScrollerElement, aTime) {
		
		aTime = VariableAliases.valueWithDefault(aTime, 0);
		
		var newCommand = (new ClassReference()).init();
		
		newCommand.elementReevaluator = StaticVariableObject.createReevaluationObject(aElement);
		newCommand.scrollerElementReevaluator = StaticVariableObject.createReevaluationObject(aScrollerElement);
		newCommand.timeReevaluator = StaticVariableObject.createReevaluationObject(aTime);
		
		return newCommand;
	};
});