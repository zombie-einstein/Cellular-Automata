'use strict';

// *********************************************************************
// ******** CLASS AND METHODS FOR 1-D RULESET **************************
// *********************************************************************


// ruleSet constructor for n neighbours and s states (excluding the dead state 0,0,0,0 )
function ruleSet( n, s ){

	this.name;																							// Ruleset name
	this.numNeighbours	= n;																// Range of neighbours
	this.numStates 			= s;																// Number of states
	this.dimensions 		= new vec( n+s+1, binomial(s+n,n)+1 );	// Dimensions of ruleset
	this.stateData			= new Uint8Array( 4*(s+1) );

	this.rules					= [];


}

// Add rule to Ruleset
ruleSet.prototype.addRule = function( x, y, n ){

	this.rules.splice( this.rules.length, 0, x, y, n );

}

// Set state cell colour value
ruleSet.prototype.setStateValue = function( n, r, g, b, a ){

	this.stateData[n*4] 	= r;
	this.stateData[n*4+1]	= g;
	this.stateData[n*4+2]	= b;
	this.stateData[n*4+3]	= a;

}

// ******* CURRENT RULESET STRUCTURE AND ATTACHED TEXTURES *********

var currentRuleSet = new ruleSet(0,0);

currentRuleSet.selectedColor = 1;	// Current color selected for rule cell toggling

// Initialize WebGL context for the two canvases
currentRuleSet.ruleCanvas  = new WEBGLCANVAS( "rulecanvas" );
currentRuleSet.stateCanvas = new WEBGLCANVAS( "statecanvas" );

// Get dimensions from HTML
currentRuleSet.ruleCanvas.dimensions.x  = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.ruleCanvas.dimensions.y  = currentRuleSet.ruleCanvas.id.height;
currentRuleSet.stateCanvas.dimensions.x = currentRuleSet.ruleCanvas.id.width;
currentRuleSet.stateCanvas.dimensions.y = currentRuleSet.ruleCanvas.id.height;

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
currentRuleSet.textCanvas.context.lineWidth =2;

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


// Set rule cell colour value
currentRuleSet.setRuleValue = function( x, y, r, g, b, a ){

	this.ruleData[(x+this.dimensions.x*y)*4] 		= r;
	this.ruleData[(x+this.dimensions.x*y)*4+1]	= g;
	this.ruleData[(x+this.dimensions.x*y)*4+2]	= b;
	this.ruleData[(x+this.dimensions.x*y)*4+3]	= a;

}

// Set a rule vale from a state
currentRuleSet.setRuleFromState = function( x, y, n ){

	this.ruleData[(x+this.dimensions.x*y)*4] 		= this.stateData[4*n];
	this.ruleData[(x+this.dimensions.x*y)*4+1]	= this.stateData[4*n+1];
	this.ruleData[(x+this.dimensions.x*y)*4+2]	= this.stateData[4*n+2];
	this.ruleData[(x+this.dimensions.x*y)*4+3]	= this.stateData[4*n+3];

}

// Generate permuatations of states
currentRuleSet.permuations = function(){

	for ( var i = 0; i < this.numNeighbours; i++ ){ 					// Set bottom unused row to black
			this.setRuleValue( i, 0, 0, 0, 0, 255 );
	}

	for ( var i = 0; i < this.numStates+1; i++ ){								// Current states at bottom of texture
			this.setRuleFromState( this.numNeighbours+i, 0, i );
	}

	var y = 1;

	for ( var i = 0; i < this.numNeighbours+1; i++ ){
			for ( var j = 0; j < this.numNeighbours+1-i; j++ ){
					for ( var k = 0; k < this.numNeighbours+1-i-j; k++ ){

							for ( var a = 0; a < i; a++ ){ this.setRuleFromState( a, y, 3 ); }
							for ( var a = 0; a < j; a++ ){ this.setRuleFromState( a+i, y, 2 ); }
							for ( var a = 0; a < k; a++ ){ this.setRuleFromState( a+i+j, y, 1 ); }
							y++;

					}
			}
	}
}

currentRuleSet.loadRuleset = function( a ){

	this.name 					= a.name;
	this.numNeighbours 	= a.numNeighbours;
	this.numStates 			= a.numStates;
	this.dimensions.assign( a.dimensions );

	this.stateData 			= a.stateData.slice();
	this.ruleData 			= new Uint8Array( 4*this.dimensions.x*this.dimensions.y );	// Ruleset values
	this.permuations();

	for ( var i = 0; i < a.rules.length; i+=3 ){
			this.setRuleFromState( this.numNeighbours+a.rules[i], a.rules[i+1]+1, a.rules[i+2] );
	}
}


// Load a preset ruleset
currentRuleSet.loadPreset = function( preset ){

	this.loadRuleset( preset );

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

// Load the current rule-set texture
currentRuleSet.loadTextures = function(){


	this.stateCanvas.textures.states.loadO( this.stateCanvas.gl, this.numStates+1, 1, this.stateData );
	this.ruleCanvas.textures.ruleset.loadO( this.ruleCanvas.gl, this.dimensions.x, this.dimensions.y, this.ruleData );

}

// Push the current ruleset to the main canvas rule texture
currentRuleSet.pushRuleToMain = function(){

	mainCanvas.loadRuleset( this );

}

// Render the current rule-set texture to the canvas
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
		this.textCanvas.context.moveTo(this.numNeighbours*this.textCanvas.width/this.dimensions.x,0);
		this.textCanvas.context.lineTo(this.numNeighbours*this.textCanvas.width/this.dimensions.x,this.textCanvas.height);
		this.textCanvas.context.stroke();
		this.textCanvas.context.beginPath();
		this.textCanvas.context.moveTo(0,this.textCanvas.height-this.textCanvas.height/this.dimensions.y);
		this.textCanvas.context.lineTo(this.textCanvas.width,this.textCanvas.height-this.textCanvas.height/this.dimensions.y);
		this.textCanvas.context.stroke();
}

currentRuleSet.ruleClick = function( event ){

	// Get mouse position and convert to cell grid number
	var mousePos 	= this.ruleCanvas.getMousePos( event );
	var x = Math.floor(mousePos.x * this.dimensions.x / this.ruleCanvas.dimensions.x );
	var y = Math.floor(mousePos.y * this.dimensions.y / this.ruleCanvas.dimensions.y  );
	var n = 4*(x+this.dimensions.x*y);

	if ( x > this.numNeighbours-1 && y > 0 ){
		if ( this.ruleData[n] == 0 && this.ruleData[n+1] == 0 && this.ruleData[n+2] == 0 && this.ruleData[n+3] == 0 ){
			this.setRuleFromState( x, y, this.selectedColor );
		}
		else{	this.setRuleFromState(x,y,0); }

		this.name = "Custom";
		document.getElementById("loadpreset").value = "custom";

		this.loadTextures();
		this.renderTextures();
		this.pushRuleToMain();

	}
}

currentRuleSet.stateClick = function(event){

	var mousePos 	= this.stateCanvas.getMousePos( event );
	var x = Math.floor(mousePos.x * (this.numStates+1) / this.stateCanvas.dimensions.x );

	if ( x > 0 ){ this.selectedColor = x;	}
}

currentRuleSet.setRandomRules = function(){

	for ( var i=0; i < this.numStates+1; i++ ){
		for ( var j = 0; j < this.dimensions.y-1; j++ ){
				this.setRuleFromState( this.numNeighbours+i, j+1, Math.floor(Math.random()*(this.numStates+1)) );
		}
	}
	this.name = "Random"
	document.getElementById("loadpreset").value = "random";
	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

currentRuleSet.loadRenderAndPush = function(){

	this.loadTextures();
	this.renderTextures();
	this.pushRuleToMain();

}

currentRuleSet.updatePermutations = function(){

	this.permuations();
	this.loadRenderAndPush();

}

function binomial(n, k) {

    var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;

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
var neighbourhoods = { full: new NEIGHBOURHOOD("Full (8)"),
											 vonNeumann: new NEIGHBOURHOOD("Von Neumann (4)"),
											 //LColumn: 	new NEIGHBOURHOOD("L.H. Column"),
											 //RColumn: 	new NEIGHBOURHOOD("R.H. Column"),
											 //BLCorner:	new NEIGHBOURHOOD("B.L. Corner"),
											 //TRCorner:	new NEIGHBOURHOOD("T.R. Corner"),
											 //OneDLeft:	new NEIGHBOURHOOD("1-D Left"),
											 //OneDRight:	new NEIGHBOURHOOD("1-D Right"),
										 };

	// NOTE these arrays must have an even length
	neighbourhoods.full.array 			= [ -1,-1,-1, 0,-1, 1, 0,-1, 0, 1, 1,-1, 1, 0, 1, 1 ];
	neighbourhoods.vonNeumann.array = [ -1, 0, 0,-1, 0, 1, 1, 0 ];
	//neighbourhoods.LColumn.array 		= [ -1,-1,-1, 0,-1, 1 ];
	//neighbourhoods.RColumn.array 		= [  1,-1, 1,0, 1,1 ];
	//neighbourhoods.BLCorner.array 	= [ -1,-1,-1,0,-1,1,0,-1,1,-1];
	//neighbourhoods.TRCorner.array 	= [ -1,1,0,1,1,-1,1,0,1,1 ];
	//neighbourhoods.OneDLeft.array 	= [ -1,-1,-1,1 ];
	//neighbourhoods.OneDRight.array 	= [  1,-1,1,1 ];

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
currentNeighbourhood.createMenu = function(){
	for ( var x in neighbourhoods ){
		document.getElementById("neighbourhoodSelect").innerHTML = document.getElementById("neighbourhoodSelect").innerHTML+'<option value='+x.toString()+'> '+neighbourhoods[x].name+' </option>';
	}
}
