/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.turkishairlines.GetMovieLocationsApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var GetMovieLocationsApplication = dbm.importClass("dbm.projects.tools.work.turkishairlines.GetMovieLocationsApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.turkishairlines.GetMovieLocationsApplication::_init");
		
		this.superCall();
		
		this._fullString = "";
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("dbm.projects.tools.work.turkishairlines.GetMovieLocationsApplication::_load");
		
		var key = "AIzaSyB7KeVPc90j9df5WkAgSRjHubBtAvfO0Z0";
		var engineId = "007826195105171803720:r4vu66yn-b4";
		
		var loadingSequence = LoadingSequence.create();
		loadingSequence._maxNumberOfSimiltaniousLoaders = 1;
		
		//var currentArray = ["Amsterdam", "Alexandria", "Athens", "Ankara", "Bangkok", "Barcelona", "Bacelona", "Beirut", "Beijing", "Berlin", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Cairo", "Cape Town", "Casablanca", "Chicago", "Copenhagen", "Dublin", "Dubai", "Edinburgh", "Edingburgh", "Frankfurt", "Geneva", "Hanoi", "Helsinki", "Hong Kong", "Istanbul", "Johannesburg", "Kiev", "Kuala Lumpur", "Kuwait", "Lagos", "Los Angeles", "London", "Lisbon", "Jakarta", "Madrid", "Miami", "Milan", "Minsk", "Moscow", "Mumbai", "Nairobi", "Malta", "Manchester", "Marseille", "Munich", "New York City", "Nice", "Saint Petersburg", "Osaka", "Naples", "Paris", "Oslo", "Prague", "Rome", "Riga", "Seoul", "Shanghai", "Sharm el-Sheikh", "Singapore", "Stockholm", "São Paulo", "Tallinn", "Tel Aviv", "Tokyo", "Toronto", "Venice", "Warsaw", "Washington,  D.C.", "Zagreb", "Zürich", "Boston", "Birmingham", "Houston", "Aalborg", "Abidjan", "Abu Dhabi", "Accra", "Adana", "Addis Ababa", "Aden", "Adıyaman", "Ağrı", "Algiers", "Almaty", "Amman", "Antalya", "Aqaba", "Ashgabat", "Astana", "Baghdad", "Bahrain", "Baku", "Basel", "Mulhouse", "Freiburg", "Basra", "Batman", "Batumi", "Belgrade", "Benghazi", "Bilbao", "Billund", "Bingöl", "Bishkek", "Bodrum", "Bologna", "Bordeaux", "Bremen", "Catania", "Chișinău", "Cologne/Bonn", "Colombo", "Constanța", "Constantine", "Dar es Salaam", "Delhi", "Denizli", "Dhaka", "Diyarbakır", "Djibouti", "Dnipropetrovsk", "Doha", "Donetsk", "Douala", "Dushanbe", "Düsseldorf", "Elazığ", "Entebbe/Kampala", "Erbil", "Erzincan", "Erzurum", "Eskişehir", "Friedrichshafen", "Ganja", "Gassim", "Gaziantep", "Gothenburg", "Hamburg", "Ho Chi Minh City", "Genoa", "Guangzhou", "Dakar", "Dalaman", "Dammam", "Hanover", "Hatay", "Hurghada", "Isfahan", "Islamabad", "Isparta", "İzmir", "Iğdır", "Jeddah", "Kabul", "Kahramanmaraş", "Kano", "Karachi", "Kars", "Kastamonu", "Kathmandu", "Kayseri", "Kazan", "Kermanshah", "Khartoum", "Kigali", "Kilimanjaro", "Kinshasa", "Konya", "Kütahya", "Lahore", "Leipzig", "Libreville", "Ljubljana", "Luxembourg", "Lviv", "Lyon", "Maastricht", "Málaga", "Malatya", "Malé", "Mardin", "Mashhad", "Mazar-i-Sharif", "Medina", "Merzifon", "Misrata", "Mogadishu", "Mombasa", "Montreal", "Mosul", "Muş", "Muscat", "Münster/Osnabrück", "N'Djamena", "Najaf", "Nakhchivan", "Nevşehir", "Niamey", "Nicosia", "Nouakchott", "Novosibirsk", "Nuremberg", "Odessa", "Oran", "Osh", "Ouagadougou", "Pisa", "Podgorica", "Pristina", "Riyadh", "Rostov-on-Don", "Rotterdam/The Hague", "Salzburg", "Samsun", "Sana'a", "Şanlıurfa", "Santiago de Compostela", "Sarajevo", "Shiraz", "Simferopol", "Sinop", "Şırnak", "Sivas", "Skopje", "Sochi", "Sofia", "Stavropol", "Strasbourg", "Stuttgart", "Sulaymaniyah", "Tabriz", "Ta'if", "Tashkent", "Tbilisi", "Tehran", "Tekirdağ", "Thessaloniki", "Tirana", "Tlemcen", "Toulouse", "Trabzon", "Tripoli", "Tunis", "Turin", "Ufa", "Ulan Bator", "Varna", "Valencia", "Van", "Vienna", "Vilnius", "Yanbu", "Yaoundé", "Yekaterinburg"];
		var currentArray = ["Batumi", "Belgrade", "Benghazi", "Bilbao", "Billund", "Bingöl", "Bishkek", "Bodrum", "Bologna", "Bordeaux", "Bremen", "Catania", "Chișinău", "Cologne/Bonn", "Colombo", "Constanța", "Constantine", "Dar es Salaam", "Delhi", "Denizli", "Dhaka", "Diyarbakır", "Djibouti", "Dnipropetrovsk", "Doha", "Donetsk", "Douala", "Dushanbe", "Düsseldorf", "Elazığ", "Entebbe/Kampala", "Erbil", "Erzincan", "Erzurum", "Eskişehir", "Friedrichshafen", "Ganja", "Gassim", "Gaziantep", "Gothenburg", "Hamburg", "Ho Chi Minh City", "Genoa", "Guangzhou", "Dakar", "Dalaman", "Dammam", "Hanover", "Hatay", "Hurghada", "Isfahan", "Islamabad", "Isparta", "İzmir", "Iğdır", "Jeddah", "Kabul", "Kahramanmaraş", "Kano", "Karachi", "Kars", "Kastamonu", "Kathmandu", "Kayseri", "Kazan", "Kermanshah", "Khartoum", "Kigali", "Kilimanjaro", "Kinshasa", "Konya", "Kütahya", "Lahore", "Leipzig", "Libreville", "Ljubljana", "Luxembourg", "Lviv", "Lyon", "Maastricht", "Málaga", "Malatya", "Malé", "Mardin", "Mashhad", "Mazar-i-Sharif", "Medina", "Merzifon", "Misrata", "Mogadishu", "Mombasa", "Montreal", "Mosul", "Muş", "Muscat", "Münster/Osnabrück", "N'Djamena", "Najaf", "Nakhchivan", "Nevşehir", "Niamey", "Nicosia", "Nouakchott", "Novosibirsk", "Nuremberg", "Odessa", "Oran", "Osh", "Ouagadougou", "Pisa", "Podgorica", "Pristina", "Riyadh", "Rostov-on-Don", "Rotterdam/The Hague", "Salzburg", "Samsun", "Sana'a", "Şanlıurfa", "Santiago de Compostela", "Sarajevo", "Shiraz", "Simferopol", "Sinop", "Şırnak", "Sivas", "Skopje", "Sochi", "Sofia", "Stavropol", "Strasbourg", "Stuttgart", "Sulaymaniyah", "Tabriz", "Ta'if", "Tashkent", "Tbilisi", "Tehran", "Tekirdağ", "Thessaloniki", "Tirana", "Tlemcen", "Toulouse", "Trabzon", "Tripoli", "Tunis", "Turin", "Ufa", "Ulan Bator", "Varna", "Valencia", "Van", "Vienna", "Vilnius", "Yanbu", "Yaoundé", "Yekaterinburg"];
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var searchQuery = currentArray[i];
			var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + engineId + "&q=" + searchQuery;
		
			var loader = JsonAsset.create(url);
			loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._dataLoaded, [searchQuery, loader]));
			loadingSequence.addAsset(loader);
		}
		
		loadingSequence.load();
	};
	
	objectFunctions._dataLoaded = function(aLocation, aLoader) {
		console.log("dbm.projects.tools.work.turkishairlines.GetMovieLocationsApplication::_dataLoaded");
		
		var data = aLoader.getData();
		var totalCount = data.searchInformation.totalResults;
		this._fullString += aLocation + " - " + totalCount + " result" + ((totalCount === 1) ? "" : "s") + "\n";
		if(data.items) {
			var currentArray = data.items;
			var currentArrayLength = currentArray.length;
			
			for(var i = 0; i < currentArrayLength; i++) {
				var currentItem = currentArray[i];
				this._fullString +=  " " + currentItem.title + "\n";
				this._fullString +=  "  " + currentItem.snippet.split("\n").join(" ") + "\n";
				this._fullString +=  "  " + currentItem.link + "\n";
			}
		}
		
		
		console.log(this._fullString);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});