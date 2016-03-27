'use strict';

// *********************************************************************
// ******** CLASS AND METHODS FOR GOL RULESET **************************
// *********************************************************************

function ruleSet( x, y ){

	this.name;				// Ruleset name
	this.dimensions = new vec( x, y );

	this.data = new Uint8Array( 4*x*y );

}

// Set a single pixels value
ruleSet.prototype.setValue = function( n, r, g, b, a ){

	this.data[n*4] 		= r;
	this.data[n*4+1]	= g;
	this.data[n*4+2]	= b;
	this.data[n*4+3]	= a;

}

// Set a single pixel to alive
ruleSet.prototype.setAlive = function( n ){

	this.setValue( n, 255, 0, 0, 255 );

}


var ruleCanvas = new WEBGLCANVAS( "rulecanvas" );

// Get dimensions from HTML
ruleCanvas.dimensions.x = ruleCanvas.id.width;
ruleCanvas.dimensions.y = ruleCanvas.id.height;

// Create WebGL context for this context
ruleCanvas.initWebGL();

// Simple display shader to display rule texture
ruleCanvas.addProgram( "display", "2d-vertex-shader", "2d-fragment-display" );

// Add color shift location to display (to get correct live cell color)
ruleCanvas.programs.display.addUniform( ruleCanvas.gl, "colorLocation", "u_colorShift" );

// Attach the current ruleset to
ruleCanvas.currentRuleSet = new ruleSet(0,0);

// Only one texture required to display ruleset
ruleCanvas.textures.ruleset = new TEXTURE;

// *********************************************
// ********* FUNCTION DEFINITIONS **************
// *********************************************

// Load a preset ruleset
ruleCanvas.loadPreset = function( preset ){

	this.currentRuleSet.name = preset.name;
	this.currentRuleSet.dimensions.x = preset.dimensions.x;
	this.currentRuleSet.dimensions.y = preset.dimensions.y;
	this.currentRuleSet.data = preset.data.slice();

	this.loadRuleTexture();
	this.renderRules();
	this.pushRuleToMain();
}

// Load the current rule-set texture
ruleCanvas.loadRuleTexture = function(){

	this.textures.ruleset.loadO( this.gl, this.currentRuleSet.dimensions.x, this.currentRuleSet.dimensions.y, this.currentRuleSet.data  );

}

// Push the current ruleset to the main canvas rule texture
ruleCanvas.pushRuleToMain = function(){

	mainCanvas.loadRuleset( this.currentRuleSet );

}

// Render the current rule-set texture to the canvas
ruleCanvas.renderRules = function(){

	this.gl.useProgram( this.programs.display.program );
  // Set color shift to achieve live cell color
  this.gl.uniform4f( this.programs.display.colorLocation, aliveColor[0], aliveColor[1] ,aliveColor[2], 0 );
  // Bind texture
  this.gl.activeTexture( this.gl.TEXTURE0 );
  this.gl.bindTexture( this.gl.TEXTURE_2D, this.textures.ruleset.data );
  this.gl.viewport( 0, 0, this.dimensions.x, this.dimensions.y );
  this.programs.display.render( this.gl );

}

ruleCanvas.clickEvent = function( event ){

	this.currentRuleSet.name = "Custom";
	document.getElementById("loadpreset").value = "custom";
	// Get mouse position and convert to cell grid number
	var mousePos 	= this.getMousePos( event );
	var x = Math.floor(mousePos.x * this.currentRuleSet.dimensions.x / this.dimensions.x );
	var y = Math.floor(mousePos.y * this.currentRuleSet.dimensions.y / this.dimensions.y  );

	var n = 4*( x + this.currentRuleSet.dimensions.x * y );

	if ( x > 0 && y < 2 ){
		if ( this.currentRuleSet.data[n] == 0 ){
			this.currentRuleSet.data[n] = 255;
			this.currentRuleSet.data[n+3] = 255;
		}
		else{	this.currentRuleSet.data[n] = 0;
					this.currentRuleSet.data[n+3] = 0;	}
	}

	this.loadRuleTexture();
	this.renderRules();
	this.pushRuleToMain();

}

// *****************************************************************
// ******** ARRAY AND OBJECT CONTAINING CELL NEIGHBOURHOODS ********
// *****************************************************************

function NEIGHBOURHOOD( name ){

	this.name = name;
	this.array = [];

}

// Variable for current neighbourhood pattern
// (Loaded automatically to the shader every cycle by main GOL loop)
var currentNeighbourhood = new NEIGHBOURHOOD( "Current")

// Object containing preset neighbourhood patterns
// (Adding a neigbourhood here will make it show up in the HTML menu)
var neighbourhoods = { full: new NEIGHBOURHOOD("Full"), vonNeumann: new NEIGHBOURHOOD("Von Neumann"), twoDL: new NEIGHBOURHOOD("2D Left") };
	// NOTE these arrays must have an even length
	neighbourhoods.full.array = [ -1,-1,-1,0,-1,1,0,-1,0,1,1,-1,1,0,1,1 ];
	neighbourhoods.vonNeumann.array = [ -1,0,0,-1,0,1,1,0 ];
	neighbourhoods.twoDL.array = [ -1,-1,-1,0,-1,1 ];

// *********************************************
// ********* FUNCTION DEFINITIONS **************
// *********************************************

// Load a neighbourhood to the current neighbourhood
currentNeighbourhood.load = function( A ){

	currentNeighbourhood.name = A.name;
	currentNeighbourhood.array = A.array.slice();
	console.log( A.name+" neighbourhood loaded" );

}

// Fill the entries of the neighbourhood selection menu in HTML
for ( var x in neighbourhoods ){
document.getElementById("neighbourhoodSelect").innerHTML = document.getElementById("neighbourhoodSelect").innerHTML+'<option value='+x.toString()+'> '+neighbourhoods[x].name+' </option>';
}
