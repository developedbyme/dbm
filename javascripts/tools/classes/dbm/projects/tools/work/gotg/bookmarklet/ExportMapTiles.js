/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.gotg.bookmarklet.ExportMapTiles", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ExportMapTiles = dbm.importClass("dbm.projects.tools.work.gotg.bookmarklet.ExportMapTiles");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ImageAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ImageAsset");
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var UrlFunctions = dbm.importClass("dbm.utils.native.string.UrlFunctions");
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	var MapFunctions = dbm.importClass("dbm.thirdparty.google.maps.MapFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.gotg.bookmarklet.ExportMapTiles::_init");
		
		this.superCall();
		
		this._canvas = null;
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("dbm.projects.tools.work.gotg.bookmarklet.ExportMapTiles::_load");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		this._canvas = htmlCreator.createNode("canvas", {"width": 512, "height": 512});
		
		var loadingSequence = LoadingSequence.create();
		loadingSequence._maxNumberOfSimiltaniousLoaders = 1;
		
		
		
		var currentDate = new Date();
		var dateString = IsoDate.getCompactIsoDateAndTime(currentDate);
		
		var planet1Array = [
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.099426,-112.089333,3a,75y,310.27h,85.68t/data=!3m5!1e1!3m3!1s8kl3Wd2EzBNq3RS5hNzh5Q!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.099551,-112.089207,3a,75y,332.03h,78.18t/data=!3m5!1e1!3m3!1sx8wzN9sr7EDP9UmHZhzO-w!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.099645,-112.088861,3a,75y,329.09h,69.46t/data=!3m5!1e1!3m3!1sq5Xcw5F6zmydbRlScfANaQ!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.100074,-112.088681,3a,75y,348.35h,78.79t/data=!3m5!1e1!3m3!1sxzND80dRvg21suNW4QG77g!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.100428,-112.088864,3a,75y,323.89h,81.85t/data=!3m5!1e1!3m3!1s7p3jpND8SmIIiil0v_xlzA!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@36.100508,-112.088933,3a,75y,299.01h,73.39t/data=!3m5!1e1!3m3!1ss_bQUnky2FK0Bk4-Y5RsZw!2e0!3e5")
		];
		
		var planet2Array = [
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@1.28175,103.856934,3a,75y,272.07h,108.67t/data=!3m5!1e1!3m3!1sz5K3z790xnVL5TzotepK3A!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@1.282206,103.857207,3a,75y,39.49h,93.7t/data=!3m5!1e1!3m3!1slmZgnnMh164imbubizlc8A!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@1.283925,103.858496,3a,75y,110.73h,106.31t/data=!3m5!1e1!3m3!1sqmeNoCXbAuiVJMv1e1SVdw!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@1.284855,103.858952,3a,75y,6.66h,88.85t/data=!3m5!1e1!3m3!1shaCK9m8m9eudMYQLDKme0w!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@1.285686,103.859012,3a,75y,19.54h,112.31t/data=!3m5!1e1!3m3!1s9iUzIhQjXd-Yfx3q15KwRQ!2e0!3e5")
		];
		
		var planet3Array = [
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@22.194714,113.537461,3a,75y,280.98h,74.11t/data=!3m4!1e1!3m2!1sgs2bp5eA_kaelTF9FZJwDw!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@22.195185,113.537216,3a,75y,188.4h,81.69t/data=!3m4!1e1!3m2!1sys1RxgaONIgdHvQPEbsJPQ!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@22.19461,113.536563,3a,75y,124.13h,74.77t/data=!3m4!1e1!3m2!1sRzPPjpyZDVu0CItTGBg27g!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@22.196269,113.53682,3a,75y,27.46h,91.7t/data=!3m4!1e1!3m2!1s3IswGG8RKuHqPJosk_aG-A!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.com/maps/@22.194946,113.537369,3a,75y,198.76h,78.23t/data=!3m4!1e1!3m2!1sclzEHqurLrziXpnL9sVStA!2e0")
		];
		
		var films0Array = [
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@48.885925,2.343242,3a,90y,262.39h,87.12t/data=!3m5!1e1!3m3!1sEwlZBGMyTcsAAAQXIjGTRA!2e0!3e11")
		];
		
		var films3Array = [
			/*MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@51.499286,-0.122528,3a,75y,235.27h,91.77t/data=!3m5!1e1!3m3!1sHP3IvNWvAqL8FeWUaquYtg!2e0!3e5"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.719092,-73.989733,3a,75y,271.06h,88.78t/data=!3m4!1e1!3m2!1socX3xKUOaoj7OXOvuOD1GQ!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/place/Brooklyn+Bridge/@40.68934,-74.043595,3a,75y,256.98h,110.26t/data=!3m5!1e1!3m3!1sP2bp6FX-laQAAAQWqtweCQ!2e0!3e11!4m2!3m1!1s0x89c25a2343ce7b2b:0x2526ddba7abd465c"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/search/News+Building,+220+42nd+Street,+New+York/@40.75016,-73.973011,3a,75y,242.11h,141.38t/data=!3m4!1e1!3m2!1s5o0rjIWpkd7v13j6e7MTGw!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.750596,-73.976667,3a,45y,297.24h,75.97t/data=!3m4!1e1!3m2!1sTKEkuDHqcIc0IpQyvzyt4A!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.76283,-73.973655,3a,90y,110.25h,97.59t/data=!3m4!1e1!3m2!1szfWQGoJaTxtZEYdpOXaojw!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.719747,-74.00657,3a,83.3y,197.6h,103.58t/data=!3m4!1e1!3m2!1sdVczeDt-pm5_dZGuVp2XVg!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.719762,-74.006699,3a,75y,161.06h,79.07t/data=!3m4!1e1!3m2!1sdAwH740w-GBJ4MhJUiq1Ig!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.750296,-73.973329,3a,90y,213h,91.32t/data=!3m4!1e1!3m2!1sY-a4FVxxN3pk7xvOHs4FLQ!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/place/Rockefeller+Center/@40.758577,-73.978272,3a,59.7y,1.01h,85.75t/data=!3m5!1e1!3m3!1s-IoI3yXYkSsAAAQWs8gUFw!2e0!3e11!4m2!3m1!1s0x89c258fecf664df5:0x33d224a0d5dacca2"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.762787,-73.973552,3a,90y,256.47h,82.14t/data=!3m4!1e1!3m2!1s4DB_46Reql6durAnmTB3pg!2e0"),*/
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.719731,-74.006441,3a,75y,102.87h,90.91t/data=!3m4!1e1!3m2!1siuwQUX-lpn1bu2OQPfKgXw!2e0"),
			MapFunctions.getPanoIdFromUrl("https://www.google.co.uk/maps/@40.719693,-74.006125,3a,75y,102.87h,90.91t/data=!3m4!1e1!3m2!1sNQhD4oYxl3knykDN1fq_yQ!2e0")
			
		]
		
		//this._createSteps("geo2.ggpht.com", "planet1", planet1Array, dateString, loadingSequence);
		//this._createSteps("geo2.ggpht.com", "planet2", planet2Array, dateString, loadingSequence);
		//this._createSteps("geo3.ggpht.com", "planet3", planet3Array, dateString, loadingSequence);
		
		//this._createSteps("geo0.ggpht.com", "films0", films0Array, dateString, loadingSequence);
		this._createSteps("geo3.ggpht.com", "films3", films3Array, dateString, loadingSequence);
		
		loadingSequence.load();
	};
	
	objectFunctions._createSteps = function(aServer, aName, aPanoIds, aDateString, aLoadingSequence) {
		
		var zoomLevel = 5; // 3; // 4; // 5;
		var numberOfTilesX = 26; // 7; // 13; //26;
		var numberOfTilesY = 13; // 4; // 7; //13;
		
		var currentArray = aPanoIds;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentId = currentArray[i];
			for(var j = 0; j < numberOfTilesX; j++) {
				for(var k = 0; k < numberOfTilesY; k++) {
					
					var path = "mapTiles/" + aDateString + "/" + aName + "/step" + (i+1) +"/zoom" + zoomLevel + "/image_" + j + "x" + k + ".jpg";
					
					var loader = this._createLoader(aServer, currentId, j, k, zoomLevel);
					loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._saveImage, [path, loader]));
					aLoadingSequence.addAsset(loader);
				}
			}
		}
	};
	
	objectFunctions._createLoader = function(aServer, aPanoramaId, aX, aY, aZoom) {
		var url = "http://" + aServer + "/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=" + aPanoramaId + "&output=tile&x=" + aX + "&y=" + aY + "&zoom=" + aZoom;
		
		var loader = ImageAsset.create(url);
		return loader;
	};
	
	objectFunctions._saveImage = function(aPath, aLoader) {
		//console.log("dbm.projects.tools.work.gotg.bookmarklet.ExportMapTiles::_saveImage");
		console.log(aPath);
		
		var context = this._canvas.getContext("2d");
		context.drawImage(aLoader.getData(), 0, 0);
		var data = UrlFunctions.getDataFromDataUrl(this._canvas.toDataURL("image/jpeg", 1));
		
		var loader = JsonAsset.create("http://localhost:8080/dbm/examples/saveFile");
		loader.setupAsFormObjectPost({"fileName":  aPath, "dataEncoding": "base64", "data": data});
		
		loader.load();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});