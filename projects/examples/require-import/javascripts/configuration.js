(function() {
	requirejs.config(
		{
			"paths": {
				"dbm/dbm": "../../../../javascripts/dbm/dbmForRequireJs",
				"dbm/setup": "../../../../javascripts/dbm/setup",
				"dbm": "../../../../javascripts/dbm/classes/dbm",
				"Application": "classes/Application"
			},
			"map": {
				
			},
			"shim": {
				
			}
		}
	);
	
	requirejs(["startup"]);
})();