dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	var RepeadedRange = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
	var CanvasGraphics3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasGraphics3d");
	var Camera3d = dbm.importClass("com.developedbyme.utils.canvas.3d.Camera3d");
	var UseShaderProgramCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.UseShaderProgramCommand");
	var BindVertexAttribPointerCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.BindVertexAttribPointerCommand");
	var DrawArraysCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.DrawArraysCommand");
	var SetProjectionMatrixCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.SetProjectionMatrixCommand");
	var SetTransformationMatrixCommand = dbm.importClass("com.developedbyme.utils.canvas.3d.drawcommands.SetTransformationMatrixCommand");
	var GetShaderVariablesNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.webgl.GetShaderVariablesNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var ShaderVariableTypes = dbm.importClass("com.developedbyme.constants.webgl.ShaderVariableTypes");
	var WebglDrawTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglDrawTypes");
	var WebglBufferTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglBufferTypes");
	var WebglBeginModeTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglBeginModeTypes");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var fragmentShaderPath = "../../shaders/fragments/vertexColor.frag";
		var vertexShaderPath = "../../shaders/vertex/vertexColor.vert";
		
		var loader = LoadingSequence.create();
		loader.addAssetByPath(fragmentShaderPath);
		loader.addAssetByPath(vertexShaderPath);
		
		var loadedFunction = function() {
			console.log("loadedFunction");
			
			var animationTime = 2;

			var repeatedRangeNode = RepeadedRange.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, animationTime+1);
			dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
			
			var fragmentShaderAsset = dbm.singletons.dbmAssetRepository.getAsset(fragmentShaderPath);
			var vertexShaderAsset = dbm.singletons.dbmAssetRepository.getAsset(vertexShaderPath);
			
			var canvasView = CanvasView.create(document, true, "3d", {"width": 500, "height": 500, "style": "width: 500px; height: 500px;"});
			var canvasController = canvasView.getController();
			canvasController._numberOfLinksToResolve = 400;
			
			var fragmentShader = canvasController.createFragmentShader(fragmentShaderAsset.getData());
			var vertexShader = canvasController.createVertexShader(vertexShaderAsset.getData());
			var shaderProgram = canvasController.createShaderProgram(vertexShader, fragmentShader);
			//console.log(shaderProgram, fragmentShader, vertexShader);
			
			var shaderVariables = GetShaderVariablesNode.create(canvasController.getContext(), shaderProgram);
			shaderVariables.addVariable("vertexPosition", ShaderVariableTypes.ATTRIBUTE);
			shaderVariables.addVariable("vertexColor", ShaderVariableTypes.ATTRIBUTE);
			shaderVariables.addVariable("transformationMatrix", ShaderVariableTypes.UNIFORM);
			shaderVariables.addVariable("projectionMatrix", ShaderVariableTypes.UNIFORM);
			
			var triangleGraphics = CanvasGraphics3d.create();
			canvasController.getLayer("main/triangle/shape").addGraphics(triangleGraphics);
			canvasController.getLayer("main/triangle").getProperty("x").setValue(-1.2);
			canvasController.getLayer("main/triangle").getProperty("rotateY").animateValue(Math.PI, 0.5*animationTime, InterpolationTypes.QUADRIC, 0);
			canvasController.getLayer("main/triangle").getProperty("rotateY").animateValue(2*Math.PI, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRIC, 0.5*animationTime);
			var triangleVertices = [
				0.0,  1.0,  0.0,
				-1.0, -1.0,  0.0,
				1.0, -1.0,  0.0
			];
			var triangleColors = [
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0
			];
			var triangleItemSize = 3;
			var triangleColorItemSize = 4;
			var triangleLength = 3;
			var triangleBuffer = canvasController.createBuffer(WebglBufferTypes.ARRAY_BUFFER, triangleVertices, WebglDrawTypes.STATIC_DRAW);
			var triangleColorBuffer = canvasController.createBuffer(WebglBufferTypes.ARRAY_BUFFER, triangleColors, WebglDrawTypes.STATIC_DRAW);
			
			triangleGraphics.addDrawCommand(UseShaderProgramCommand.create(shaderProgram));
			triangleGraphics.addDrawCommand(SetProjectionMatrixCommand.create(shaderVariables.getProperty("projectionMatrix")));
			triangleGraphics.addDrawCommand(SetTransformationMatrixCommand.create(shaderVariables.getProperty("transformationMatrix")));
			triangleGraphics.addDrawCommand(BindVertexAttribPointerCommand.create(WebglBufferTypes.ARRAY_BUFFER, triangleBuffer, shaderVariables.getProperty("vertexPosition"), triangleItemSize));
			triangleGraphics.addDrawCommand(BindVertexAttribPointerCommand.create(WebglBufferTypes.ARRAY_BUFFER, triangleColorBuffer, shaderVariables.getProperty("vertexColor"), triangleColorItemSize));
			triangleGraphics.addDrawCommand(DrawArraysCommand.create(WebglBeginModeTypes.TRIANGLES, 0, triangleLength));
			
			
			var squareGraphics = CanvasGraphics3d.create();
			canvasController.getLayer("main/square/shape").addGraphics(squareGraphics);
			canvasController.getLayer("main/square").getProperty("x").setValue(1.2);
			canvasController.getLayer("main/square").getProperty("rotateX").animateValue(Math.PI, 0.5*animationTime, InterpolationTypes.QUADRIC, 0);
			canvasController.getLayer("main/square").getProperty("rotateX").animateValue(2*Math.PI, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRIC, 0.5*animationTime);
			
			squareVertices = [
				1.0,  1.0,  0.0,
				-1.0,  1.0,  0.0,
				1.0, -1.0,  0.0,
				-1.0, -1.0,  0.0
			];
			var squareColors = [
				0.5, 0.5, 1.0, 1.0,
				0.5, 0.5, 1.0, 1.0,
				0.5, 0.5, 1.0, 1.0,
				0.5, 0.5, 1.0, 1.0
			];
			
			var squareItemSize = 3;
			var squareColorItemSize = 4;
			var squareLength = 4;
			var squareBuffer = canvasController.createBuffer(WebglBufferTypes.ARRAY_BUFFER, squareVertices, WebglDrawTypes.STATIC_DRAW);
			var squareColorBuffer = canvasController.createBuffer(WebglBufferTypes.ARRAY_BUFFER, squareColors, WebglDrawTypes.STATIC_DRAW);
			
			squareGraphics.addDrawCommand(UseShaderProgramCommand.create(shaderProgram));
			squareGraphics.addDrawCommand(SetProjectionMatrixCommand.create(shaderVariables.getProperty("projectionMatrix")));
			squareGraphics.addDrawCommand(SetTransformationMatrixCommand.create(shaderVariables.getProperty("transformationMatrix")));
			squareGraphics.addDrawCommand(BindVertexAttribPointerCommand.create(WebglBufferTypes.ARRAY_BUFFER, squareBuffer, shaderVariables.getProperty("vertexPosition"), squareItemSize));
			squareGraphics.addDrawCommand(BindVertexAttribPointerCommand.create(WebglBufferTypes.ARRAY_BUFFER, squareColorBuffer, shaderVariables.getProperty("vertexColor"), squareColorItemSize));
			squareGraphics.addDrawCommand(DrawArraysCommand.create(WebglBeginModeTypes.TRIANGLE_STRIP, 0, squareLength));
			
			
			var camera = Camera3d.createPerspectiveProjection(1);
			canvasController.addCamera("defaultCamera", camera);
			camera.getProperty("z").setValue(4);
			canvasController.getProperty("camera").setValue(camera);
			
			canvasController.debugTraceStructure();
			
			canvasController.getProperty("display").startUpdating();
		}
		
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, loadedFunction, []));
		loader.load();
	});
});