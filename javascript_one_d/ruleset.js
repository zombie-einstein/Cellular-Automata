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

	this.statedata[n*4] 	= r;
	this.statedata[n*4+1]	= g;
	this.statedata[n*4+2]	= b;
	this.statedata[n*4+3]	= a;

}

// Set rule cell colour value
ruleSet.prototype.setRuleValue = function( x, y, r, g, b, a ){

	this.statedata[(x+this.dimensions.x*y)*4] 	= r;
	this.statedata[(x+this.dimensions.x*y)*4+1]	= g;
	this.statedata[(x+this.dimensions.x*y)*4+2]	= b;
	this.statedata[(x+this.dimensions.x*y)*4+3]	= a;

}

// Set a rule vale from a state
ruleSet.prototype.setRuleFromState = function( x, y, n ){

	setRuleValue( x, y, this.stateData(4*n), this.stateData(4*n+1), this.stateData(4*n+2), this.stateData(4*n+3) );

}

// Generate permuatations of states
ruleSet.prototype.permuations = function(){

	for ( var i = 0; i < this.dimensions.x-1; i++ ){		 										// Iterate over cell positions
	var row = 0;																				 										// Counts current row
		for( var j = 0; j < this.dimensions.y/this.numStates; j++ ){					// Number if distinct states in column
				for( var k = 0; k < Math.pow(this.numStates,2*this.range); k++ ){	// Size of block of distinct color
					this.setRuleFromState( i, row, j%this.numStates );							// Set this color for each cell in block
					row++;
				}}}
}

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

currentRuleSet.ruleCanvas  = new WEBGLCANVAS( "rulecanvas" );
currentRuleSet.stateCanvas = new WEBGLCANVAS( "statecanvas" );

// Get dimensions from HTML
currentRuleSet.ruleCanvas.dimensions.x = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.ruleCanvas.dimensions.y = currentRuleSet.ruleCanvas.id.height;
currentRuleSet.stateCanvas.dimensions.x = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.stateCanvas.dimensions.y = currentRuleSet.ruleCanvas.id.height;

// Create WebGL context for this context
currentRuleSet.ruleCanvas.initWebGL();
currentRuleSet.stateCanvas.initWebGL();

// Attach HTML 2D canvas for text overlay
currentRuleSet.ruleCanvas.textCanvas = {};
currentRuleSet.ruleCanvas.textCanvas.id = document.getElementById("ruletextoverlay");
currentRuleSet.ruleCanvas.textCanvas.context = currentRuleSet.ruleCanvas.textCanvas.id.getContext("2d");
currentRuleSet.ruleCanvas.textCanvas.width = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.ruleCanvas.textCanvas.height = currentRuleSet.ruleCanvas.id.height;
currentRuleSet.ruleCanvas.textCanvas.context.font = "12px Arial";
currentRuleSet.ruleCanvas.textCanvas.context.fillStyle = "rgba(255,255,255,0.75)";

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

}

// Load the current rule-set texture
currentRuleSet.loadTextures = function(){


	this.stateCanvas.textures.states.loadO( this.stateCanvas.gl, this.numStates, 1, this.stateData );
	this.ruleCanvas.textures.ruleset.loadO( this.ruleCanvas.gl, this.dimensions.x, this.dimensions.y, this.ruleData );

}

// Push the current ruleset to the main canvas rule texture
currentRuleSet.pushRuleToMain = function(){

//	mainCanvas.loadRuleset( this.currentRuleSet );

}

// Render the current rule-set texture to the canvas
currentRuleSet.renderTextures = function(){

	this.ruleCanvas.gl.useProgram( this.ruleCanvas.programs.display.program );
  this.ruleCanvas.gl.uniform4f( this.ruleCanvas.programs.display.colorLocation, aliveColor[0], aliveColor[1] ,aliveColor[2], 0 );	// Set color shift to achieve live cell color
  this.ruleCanvas.gl.bindTexture( this.ruleCanvas.gl.TEXTURE_2D, this.ruleCanvas.textures.ruleset.data );	// Bind texture
  this.ruleCanvas.gl.viewport( 0, 0, this.dimensions.x, this.dimensions.y );
  this.ruleCanvas.programs.display.render( this.ruleCanvas.gl );

}
/*
ruleCanvas.renderText = function(){

		this.textCanvas.context.clearRect(0,0,this.textCanvas.width,this.textCanvas.height);
		this.textCanvas.context.fillText("Neighbour", this.textCanvas.width-60 ,12);
		this.textCanvas.context.fillText("states", this.textCanvas.width-60 ,24);
		this.textCanvas.context.fillText("Updated", this.textCanvas.width-50 ,this.textCanvas.height-20);
		this.textCanvas.context.fillText("state", this.textCanvas.width-50 ,this.textCanvas.height-10);
		this.textCanvas.context.rotate( Math.PI/2 );
		this.textCanvas.context.fillText("Current", this.textCanvas.width-35 ,-10);
		this.textCanvas.context.restore();
}

ruleCanvas.clickEvent = function( event ){

	this.currentRuleSet.name = "Custom";
	document.getElementById("loadpreset").value = "custom";
	// Get mouse position and convert to cell grid number
	var mousePos 	= this.getMousePos( event );
	var x = Math.floor(mousePos.x * this.currentRuleSet.dimensions.x / this.dimensions.x );
	var y = Math.floor(mousePos.y * this.currentRuleSet.dimensions.y / this.dimensions.y  );

	var n = 4*( x + this.currentRuleSet.dimensions.x * y );

	if ( x > 0 || y < this.currentRuleSet.dimensions.y-8 ){
		if ( this.currentRuleSet.data[n] == 0 && this.currentRuleSet.data[n+1] == 0 && this.currentRuleSet.data[n+2] == 0 && this.currentRuleSet.data[n+3] == 0 ){
			this.currentRuleSet.data[n] 	= document.getElementById("Rrule").value;
			this.currentRuleSet.data[n+1] = document.getElementById("Grule").value;
			this.currentRuleSet.data[n+2] = document.getElementById("Brule").value;
			this.currentRuleSet.data[n+3] = document.getElementById("Arule").value;;
		}
		else{	this.currentRuleSet.data[n] = 0;
					this.currentRuleSet.data[n+1] = 0;
					this.currentRuleSet.data[n+2] = 0;
					this.currentRuleSet.data[n+3] = 0;	}
	}

	this.loadRuleTexture();
	this.renderRules();
	this.pushRuleToMain();

}
*/
