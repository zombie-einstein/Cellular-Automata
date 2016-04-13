'use strict';

// *********************************************************************
// ******** CLASS AND METHODS FOR 1-D RULESET **************************
// *********************************************************************

// ruleSet constructor for a given range and number of state
function ruleSet( r, n ){

	this.name;																																	// Ruleset name
	this.range 			= r;																												// Range of neighbours
	this.numStates 	= n;																												// Number of states
	this.dimensions = new vec( 2*r+2, Math.pow(n,2*r+1) );											// Dimensions of ruleset

	this.stateData 	= new Uint8Array( 4*n );																		// State values
	this.ruleData 	= new Uint8Array( 4*this.dimensions.x*this.dimensions.y );	// Ruleset values

}

// Set state cell colour value
ruleSet.prototype.setStateValue = function( n, r, g, b, a ){

	this.stateData[n*4] 	= r;
	this.stateData[n*4+1]	= g;
	this.stateData[n*4+2]	= b;
	this.stateData[n*4+3]	= a;

}

// Set rule cell colour value
ruleSet.prototype.setRuleValue = function( x, y, r, g, b, a ){

	this.ruleData[(x+this.dimensions.x*y)*4] 	= r;
	this.ruleData[(x+this.dimensions.x*y)*4+1]	= g;
	this.ruleData[(x+this.dimensions.x*y)*4+2]	= b;
	this.ruleData[(x+this.dimensions.x*y)*4+3]	= a;

}

// Set a resultant color
ruleSet.prototype.setResultValue = function( n, r, g, b, a ){

	this.setRuleValue(this.dimensions.x-1, n, r, g, b, a );

}

// Set a result value from a rule value
ruleSet.prototype.setResultFromState = function( n, m ){

	this.setResultValue( n, this.stateData[4*m], this.stateData[4*m+1], this.stateData[4*m+2], this.stateData[4*m+3] );

}

// Set a rule vale from a state
ruleSet.prototype.setRuleFromState = function( x, y, n ){

	this.setRuleValue( x, y, this.stateData[4*n], this.stateData[4*n+1], this.stateData[4*n+2], this.stateData[4*n+3] );

}

// Generate permuatations of states
ruleSet.prototype.permuations = function(){

	for ( var i = 0; i < this.dimensions.x-1; i++ ){		 											// Iterate over cell positions
	var row = 0;																				 											// Counts current row
		for( var j = 0; j < Math.pow(this.numStates, (i+1)); j++ ){							// Number if distinct states in column
				for( var k = 0; k < Math.pow(this.numStates,2*this.range-i); k++ ){	// Size of block of distinct color
					this.setRuleFromState( i, row, j%this.numStates );								// Set this color for each cell in block
					row++;
				}}}
}

// Load a ruleset
ruleSet.prototype.loadRuleset = function( a ){

	this.name 			= a.name;
	this.range 			= a.range;
	this.numStates 	= a.numStates;
	this.dimensions.assign( a.dimensions );

	this.stateData 	= a.stateData.slice();
	this.ruleData 	= a.ruleData.slice();

}

// ******* CURRENT RULESET STRUCTURE AND ATTACHED TEXTURES *********

var currentRuleSet = new ruleSet(0,0);

// State and ruleset WebGL canvases
currentRuleSet.ruleCanvas  = new WEBGLCANVAS( "rulecanvas" );
currentRuleSet.stateCanvas = new WEBGLCANVAS( "statecanvas" );

// Get dimensions from HTML
currentRuleSet.ruleCanvas.dimensions.x = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.ruleCanvas.dimensions.y = currentRuleSet.ruleCanvas.id.height;
currentRuleSet.stateCanvas.dimensions.x = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.stateCanvas.dimensions.y = currentRuleSet.ruleCanvas.id.height;

// Store the number of possible rulesets from the current configuration
currentRuleSet.numberOfRules = 0;

// Create WebGL context for this context
currentRuleSet.ruleCanvas.initWebGL();
currentRuleSet.stateCanvas.initWebGL();

// Attach HTML 2D canvas for text/line overlay
currentRuleSet.textCanvas = {};
currentRuleSet.textCanvas.id = document.getElementById("ruletextoverlay");
currentRuleSet.textCanvas.context = currentRuleSet.textCanvas.id.getContext("2d");
currentRuleSet.textCanvas.width = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.textCanvas.height = currentRuleSet.ruleCanvas.id.height;
currentRuleSet.textCanvas.context.font = "14px Arial";
currentRuleSet.textCanvas.context.lineWidth = 3;

// Simple display shader to display rule texture
currentRuleSet.ruleCanvas.addProgram( "display", "2d-vertex-shader", "2d-fragment-display" );
currentRuleSet.stateCanvas.addProgram( "display", "2d-vertex-shader", "2d-fragment-display" );

// Add color shift location to display (to get correct live cell color)
currentRuleSet.ruleCanvas.programs.display.addUniform( currentRuleSet.ruleCanvas.gl, "colorLocation", "u_colorShift" );
currentRuleSet.stateCanvas.programs.display.addUniform( currentRuleSet.stateCanvas.gl, "colorLocation", "u_colorShift" );

// Only one texture required to display ruleset
currentRuleSet.ruleCanvas.textures.ruleset = new TEXTURE;
currentRuleSet.stateCanvas.textures.states = new TEXTURE;

// *********************************************
// ********* FUNCTION DEFINITIONS **************
// *********************************************


// Load a preset ruleset
currentRuleSet.loadPreset = function( preset ){

	this.loadRuleset( preset );

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

	this.numberOfRules = Math.pow(this.numStates, this.dimensions.y);

	document.getElementById("ruleCode").max = this.numberOfRules-1;

}

// Load the current rule-set texture
currentRuleSet.loadTextures = function(){


	this.stateCanvas.textures.states.loadO( this.stateCanvas.gl, this.numStates, 1, this.stateData );
	this.ruleCanvas.textures.ruleset.loadO( this.ruleCanvas.gl, this.dimensions.x, this.dimensions.y, this.ruleData );

}

// Push the current ruleset to the main canvas rule texture
currentRuleSet.pushRuleToMain = function(){

	mainCanvas.loadRuleset( this );

}

// Render the current rule-set textures to the two rule canvas'
currentRuleSet.renderTextures = function(){

	this.ruleCanvas.gl.useProgram( this.ruleCanvas.programs.display.program );
  this.ruleCanvas.gl.uniform4f( this.ruleCanvas.programs.display.colorLocation, currentColorScheme.alive[0], currentColorScheme.alive[1] ,currentColorScheme.alive[2], 0 );	// Set color shift to achieve live cell color
  this.ruleCanvas.gl.bindTexture( this.ruleCanvas.gl.TEXTURE_2D, this.ruleCanvas.textures.ruleset.data );	// Bind texture
  this.ruleCanvas.gl.viewport( 0, 0, this.ruleCanvas.dimensions.x, this.ruleCanvas.dimensions.y );
  this.ruleCanvas.programs.display.render( this.ruleCanvas.gl );

	this.stateCanvas.gl.useProgram( this.stateCanvas.programs.display.program );
  this.stateCanvas.gl.uniform4f( this.stateCanvas.programs.display.colorLocation, currentColorScheme.alive[0], currentColorScheme.alive[1] ,currentColorScheme.alive[2], 0 );	// Set color shift to achieve live cell color
  this.stateCanvas.gl.bindTexture( this.stateCanvas.gl.TEXTURE_2D, this.stateCanvas.textures.states.data );	// Bind texture
  this.stateCanvas.gl.viewport( 0, 0, this.stateCanvas.dimensions.x, this.stateCanvas.dimensions.y );
  this.stateCanvas.programs.display.render( this.stateCanvas.gl );

	currentRuleSet.renderoverlay();

}

// Set overlay color
currentRuleSet.setOverlayColor = function( color ){

	this.textCanvas.context.strokeStyle = color;
	this.textCanvas.context.fillStyle 	= color;

}

// Render lines and text over rule texture
currentRuleSet.renderoverlay = function(){

		this.textCanvas.context.clearRect(0,0,this.textCanvas.width,this.textCanvas.height);
		this.textCanvas.context.fillText("Permutations", 5 ,15);
		this.textCanvas.context.beginPath();
		this.textCanvas.context.moveTo((this.dimensions.x-1)*this.textCanvas.width/this.dimensions.x+2,0);
		this.textCanvas.context.lineTo((this.dimensions.x-1)*this.textCanvas.width/this.dimensions.x+2,this.textCanvas.height);
		this.textCanvas.context.stroke();
}

// When the rule canavas is clicked on toggle the cell color ( color value taken from HTML )
currentRuleSet.ruleClick = function( event ){

	// Get mouse position and convert to cell grid number
	var mousePos 	= this.ruleCanvas.getMousePos( event );
	var x = Math.floor(mousePos.x * this.dimensions.x / this.ruleCanvas.dimensions.x );
	var y = Math.floor(mousePos.y * this.dimensions.y / this.ruleCanvas.dimensions.y  );

	var n = 4*(x+this.dimensions.x*y);

	if ( x > this.dimensions.x-2 ){
		if ( this.ruleData[n] == 0 && this.ruleData[n+1] == 0 && this.ruleData[n+2] == 0 && this.ruleData[n+3] == 0 ){
			this.setResultValue( y, document.getElementById("Rrule").value, document.getElementById("Grule").value, document.getElementById("Brule").value, document.getElementById("Arule").value );
		}
		else{	this.setResultValue(y,0,0,0,0); }

		this.name = "Custom";
		document.getElementById("loadpreset").value = "custom";

		this.loadTextures();
		this.renderTextures();
		this.pushRuleToMain();

	}
}

// When the state canvas is clicked on toggle the cell value
currentRuleSet.stateClick = function(event){
	this.name = "Custom";
	document.getElementById("loadpreset").value = "custom";
	var mousePos 	= this.stateCanvas.getMousePos( event );
	var x = Math.floor(mousePos.x * this.numStates / this.stateCanvas.dimensions.x );

	if ( this.stateData[4*x] == 0 && this.stateData[4*x+1] == 0 && this.stateData[4*x+2] == 0 && this.stateData[4*x+3] == 0 ){
		this.setStateValue( x, document.getElementById("Rrule").value, document.getElementById("Grule").value, document.getElementById("Brule").value, document.getElementById("Arule").value );
	}
	else{	this.setStateValue(x,0,0,0,0); }

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

// Generate a random ruleset from the state color values
currentRuleSet.setRandomResults = function(){

	this.name = "Random";

	for( var i=0; i < this.dimensions.y; i++ ){
		this.setResultFromState( i, Math.floor(Math.random()*this.numStates) );
	}

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

// Set the current rules from an integern by resolving state in base of states
currentRuleSet.setResultFromInt = function( n ){

	if ( n > this.numberOfRules-1 ){ alert("Value outside range of rules"); return; }

	var s = n.toString(this.numStates);			// Convert number to string
	this.name = n.toString();
	var values = [];												// Store values in this
	for ( var i = 0; i < s.length; i++ ){
			values[i] = parseInt( s[i] );				// Transfer string values into the array
	}

	values.reverse();												// Reverse this string to get it in
																					// the right direction for ruleset

	for ( var i = s.length; i < this.dimensions.y; i++ ){
			values[i] = 0;											// Set remaining values to 0
			//values.unshift(0);
	}

	for ( var i = 0; i < this.dimensions.y; i ++ ){
			this.setResultFromState( i, values[i]);	// Set the ruleset values from these values
	}

	this.loadRenderAndPush();

}

// Creat new textures, render them to the canvases and push the rule texture to the main canvas
currentRuleSet.loadRenderAndPush = function(){

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

// Update the rule permutations from the current state colors
currentRuleSet.updatePermutations = function(){

	this.permuations();
	this.loadRenderAndPush();

}
