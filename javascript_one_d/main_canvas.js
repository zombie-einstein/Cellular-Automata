'use strict';

// ***********************************************************
// INITIALIZES AND EXTENDS THE MAIN GAME OF LIFE CANVAS OBJECT
// ***********************************************************

// Create main canvas object
var mainCanvas = new WEBGLCANVAS( "canvas" );

// Get dimensions from HTML
mainCanvas.dimensions.x = window.innerWidth-document.getElementById("menus").offsetWidth;
mainCanvas.dimensions.y = window.innerHeight;

// Set canvas dimensions from these values
mainCanvas.resize();

// Start WebGL
mainCanvas.initWebGL();

// Add display and rule based shaders to this object
mainCanvas.addProgram( "display", "2d-vertex-shader", "2d-fragment-display" );
mainCanvas.addProgram( "rules"  , "2d-vertex-shader", "2d-fragment-rules"   );

// ====== Add required uniform locations =======

// Add color shift location to display (to get correct live cell color)
mainCanvas.programs.display.addUniform( mainCanvas.gl, "colorLocation", "u_colorShift" );

// Add (all the!!) uniforms for rule frament shader
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "currentRowLocation", "u_currentRow" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "numStatesLocation", "u_numStates" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "rangeLocation", "u_range" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "textPixelLocation", "u_textPixel" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "rulePixelLocation", "u_rulePixel" );

// Get texture locations
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "backText0Location", "u_backText;" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, "ruleText1Location", "u_rulesText" );

// ======= Add Required Textures =======
mainCanvas.textures.front = new TEXTURE;  // Display texture
mainCanvas.textures.back  = new TEXTURE;   // Back texture for purpose of updating state
mainCanvas.textures.rule  = new TEXTURE;   // Texture which encodes ruleset

// ======= Simultation Variables =======
mainCanvas.currentRow = 1.0;
mainCanvas.animReq    = undefined;      // Initialize timestep variable outside scope of animation function
mainCanvas.timeout    = undefined;
mainCanvas.fps        = undefined;         // Simulation rate
mainCanvas.paused     = true; // Simulation status switch (initially false)


// *************************************************
// *************** FUNCTION DEFINITIONS ************
// *************************************************

// Load ruleset to rule texture
mainCanvas.loadRuleset = function( ruleset ){

  this.textures.rule.loadO( this.gl, ruleset.dimensions.x, ruleset.dimensions.y, ruleset.ruleData );
  console.log(ruleset.name+" ruleset loaded");

}

// Clear the cells
mainCanvas.clearCells = function(){

  this.textures.front.clearR( this.gl );
  this.textures.back.clearR( this.gl );
  this.renderCells();

}

// Randomly set values of value of first row
mainCanvas.randomSeed = function( rate ){

  this.currentRow = 1.0;  // Reset to first row
  this.textures.front.randomFirstR( this.gl, document.getElementById("RCanvas").value, document.getElementById("GCanvas").value,document.getElementById("BCanvas").value, document.getElementById("ACanvas").value, rate  );

}

// Refresh front and back textures at new resolution
mainCanvas.updateCellDimensions = function( x, y ){

  this.textures.back.loadR( this.gl, x, y );
  this.textures.front.loadR( this.gl, x, y );

}

// Render the front texture to canvas
mainCanvas.renderCells = function(){

  this.gl.useProgram( this.programs.display.program );
  // Set color shift to achieve live cell color
  this.gl.uniform4f( this.programs.display.colorLocation, currentColorScheme.alive[0], currentColorScheme.alive[1] ,currentColorScheme.alive[2], 0 );
  // Bind texture
  this.gl.activeTexture( this.gl.TEXTURE0 );
  this.gl.bindTexture( this.gl.TEXTURE_2D, this.textures.front.data );
  this.gl.viewport( 0, 0, this.dimensions.x, this.dimensions.y );
  this.programs.display.render( this.gl );

}

// Main 1-D C.A. loop
mainCanvas.mainLoop = function(){

  this.gl.useProgram( this.programs.rules.program );

  // Send all appropriate uniforms to program
  this.gl.uniform1f( this.programs.rules.currentRowLocation, this.currentRow );
  this.gl.uniform1i( this.programs.rules.numStatesLocation, currentRuleSet.numStates );
  this.gl.uniform1i( this.programs.rules.rangeLocation, currentRuleSet.range );
  this.gl.uniform2f( this.programs.rules.rulePixelLocation, 1/(currentRuleSet.dimensions.x), 1/(currentRuleSet.dimensions.y) );
  this.gl.uniform2f( this.programs.rules.textPixelLocation, 1/(this.textures.front.dimensions.x), 1/(this.textures.front.dimensions.y) );

  // ======= Create framebuffer and attach back texture ======= //

  //Create framebuffer
  var framebuffer = this.gl.createFramebuffer();

  // Bind framebuffer
  this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, framebuffer );

  // Attach the back texture
  this.gl.framebufferTexture2D( this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures.back.data, 0 );

  // Set texture units for current ruleset
  this.gl.uniform1i(this.programs.rules.backText0Location, 0);  // texture unit 0
  this.gl.uniform1i(this.programs.rules.ruleText1Location, 1);  // texture unit 1

  // Attach ruleset texture
  this.gl.activeTexture(this.gl.TEXTURE1);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.rule.data);

  // Start to draw with front texture
  this.gl.activeTexture(this.gl.TEXTURE0);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.front.data);

  // Set buffer viewport
  this.gl.viewport( 0, 0, this.textures.front.dimensions.x, this.textures.front.dimensions.y );

  // Render to texture "back"
  this.programs.rules.render( this.gl );

  // Unbind framebuffer (hence render to canvas)
  this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );

  // Swap textures so we render the updated state
  var temp = this.textures.front;
  this.textures.front = this.textures.back;
  this.textures.back = temp;

  // Render cells to canvas
  this.renderCells();

  this.currentRow = ( this.currentRow +1.0 ) % this.textures.front.dimensions.y;

}

// Set the value of a pixel of front texture
mainCanvas.setPixelValue = function( x, y, r, g, b, a ){

  this.textures.front.setPixelValue( this.gl, x, y, r, g, b, a );

}

// Switch the state of a front texture pixel
mainCanvas.switchPixelState = function( x, y ){
  // Switch pixels between no color and colour provided from HTML
  this.textures.front.getPixelValue( this.gl, x, y ).some(function(x){ return x > 0; }) ? this.setPixelValue( x, y, 0,0,0,0 ) : this.setPixelValue( x, y, document.getElementById("RCanvas").value, document.getElementById("GCanvas").value,document.getElementById("BCanvas").value, document.getElementById("ACanvas").value );

}

// One step of simulation
mainCanvas.stepSim = function(){ this.mainLoop(); }

// Run the simultation
mainCanvas.run = function(){

  this.timeout =  setTimeout(function(){
      mainCanvas.animReq = window.requestAnimationFrame(function(){mainCanvas.run();});
      mainCanvas.stepSim() }, 1000/this.fps );

}

// Pause the simultation
mainCanvas.stop = function(){

  window.cancelAnimationFrame(this.animReq);
  clearTimeout(this.timeout);

}

// Run the simulation
mainCanvas.startSim = function(){

  if( this.paused == true ){
    //this.timeStep = setInterval( function(){mainCanvas.stepSim();}, this.speed );
    this.run();
    this.paused	= false;
    // Lighten start button to indicate status
    document.getElementById("startbutton").style.backgroundColor = currentColorScheme.highlight;
    document.getElementById("stopbutton").style.backgroundColor  = currentColorScheme.dead;
  }
  else { return; }

}

// Pause the simulation
mainCanvas.pauseSim = function(){

  // Check sim isn't already paused
	if( this.paused == false ){
		//clearInterval( this.timeStep );
    this.stop();
    this.paused = true;
		// Lighten pause button to indicate status
		document.getElementById("startbutton").style.backgroundColor = currentColorScheme.dead;
		document.getElementById("stopbutton").style.backgroundColor  = currentColorScheme.highlight;
	}
	else{ return; }

}

// Resize the Canvas if the browser is resized
mainCanvas.windowResize = function(){

  // Calculate scaling ratio of new canvas area
	var xScaling 		= ( window.innerWidth-document.getElementById("menus").offsetWidth) / this.dimensions.x ;
	var yScaling 		= window.innerHeight / this.dimensions.y ;
	// Set new canvas width
	this.dimensions.x  	= window.innerWidth-document.getElementById("menus").offsetWidth;
	this.dimensions.y 	= window.innerHeight;
	this.resize();
	// Applying scaling to cell dimensions
	cells.d.x 	*= xScaling;
	cells.d.y 	*= yScaling;
	// Reset resolution of WebGL and re-render
	this.gl.viewport(0, 0, this.dimensions.x, this.dimensions.y );
	this.renderCells();

}

// Action performed when cell is clicked on
mainCanvas.clickEvent = function( event ){

  // Get mouse position and convert to cell grid number
	var mousePos 	= this.getMousePos( event );
	var x = Math.floor(mousePos.x /cells.d.x);
	var y = Math.floor(mousePos.y /cells.d.y);
	var mouseVec = new vec( x, y );

	// Print desired pattern
	switch ( document.getElementById("presetlist").value ){

		case "single":
			this.switchPixelState( mouseVec.x, mouseVec.y );
			this.renderCells();
			break;

		case "random5":
			var random = createRandomBlock(5,5);
			random.printPattern( mouseVec );
			break;

		case "random10":
			var random = createRandomBlock(10,10);
			random.printPattern( mouseVec );
			break;

		case "random50":
			var random = createRandomBlock(50,50);
			random.printPattern( mouseVec );
			break;

		default:
			eval(document.getElementById("presetlist").value).printPattern( mouseVec );

	}

}
