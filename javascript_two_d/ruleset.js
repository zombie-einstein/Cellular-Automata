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
ruleSet.prototype.setValue = function( x, y, r, g, b, a ){

	this.data[(x+y*this.dimensions.x)*4] 		= r;
	this.data[(x+y*this.dimensions.x)*4+1]	= g;
	this.data[(x+y*this.dimensions.x)*4+2]	= b;
	this.data[(x+y*this.dimensions.x)*4+3]	= a;

}

// Set a single pixel to alive
ruleSet.prototype.setAlive = function( x, y ){

	this.setValue( x, y, 255, 0, 0, 255 );

}


var ruleCanvas = new WEBGLCANVAS( "rulecanvas" );

// Get dimensions from HTML
ruleCanvas.dimensions.x = ruleCanvas.id.width;
ruleCanvas.dimensions.y = ruleCanvas.id.height;

// Create WebGL context for this context
ruleCanvas.initWebGL();

// Attach HTML 2D canvas for text overlay
ruleCanvas.textCanvas = {};
ruleCanvas.textCanvas.id = document.getElementById("ruletextoverlay");
ruleCanvas.textCanvas.context = ruleCanvas.textCanvas.id.getContext("2d");
ruleCanvas.textCanvas.width = ruleCanvas.id.width;
ruleCanvas.textCanvas.height = ruleCanvas.id.height;
ruleCanvas.textCanvas.context.font = "12px Arial";
ruleCanvas.textCanvas.context.fillStyle = "#000000";


// Simple display shader to display rule texture
ruleCanvas.addProgram( "display", "2d-vertex-shader", "2d-fragment-display" );

// Shader program to display lines
ruleCanvas.programs.lines = {};
ruleCanvas.programs.lines.program = initProgram( ruleCanvas.gl, "2d-vertex-lines", "2d-fragment-lines" );
ruleCanvas.programs.lines.verticesLocation = ruleCanvas.gl.getAttribLocation( ruleCanvas.programs.lines.program, "a_vertices" ); // Set location for position attribute

// Add color shift location to display (to get correct live cell color)
ruleCanvas.programs.display.addUniform( ruleCanvas.gl, "colorLocation", "u_colorShift" );

// Object for the current ruleset in use
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

ruleCanvas.setOverlayColor = function( color ){

	this.textCanvas.context.strokeStyle = color;
	this.textCanvas.context.fillStyle = color;

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
  this.gl.uniform4f( this.programs.display.colorLocation, currentColorScheme.alive[0], currentColorScheme.alive[1] ,currentColorScheme.alive[2], 0 );
  // Bind texture
  this.gl.activeTexture( this.gl.TEXTURE0 );
  this.gl.bindTexture( this.gl.TEXTURE_2D, this.textures.ruleset.data );
  this.gl.viewport( 0, 0, this.dimensions.x, this.dimensions.y );
  this.programs.display.render( this.gl );

	// Render lines over texture to deliniate where rulws apply
	this.gl.useProgram( this.programs.lines.program );
  // provide line coordinates
  var lineCoOrds = this.gl.createBuffer();
  this.gl.bindBuffer( this.gl.ARRAY_BUFFER, lineCoOrds );
  this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( [ -1.0, 1.0-8*2/this.textures.ruleset.dimensions.y,
																																 1.0, 1.0-8*2/this.textures.ruleset.dimensions.y,
																																 2/this.textures.ruleset.dimensions.x-1.0, 1.0,
																																 2/this.textures.ruleset.dimensions.x-1.0,-1.0 ] ), this.gl.STATIC_DRAW );
  this.gl.enableVertexAttribArray( this.programs.lines.verticesLocation );
  this.gl.vertexAttribPointer( this.programs.lines.verticesLocation, 2, this.gl.FLOAT, false, 0, 0 );
	this.gl.drawArrays( this.gl.LINES, 0, 4 );

}

ruleCanvas.renderText = function(){

		this.textCanvas.context.clearRect(0,0,this.textCanvas.width,this.textCanvas.height);
		this.textCanvas.context.fillText("Neighbour", this.textCanvas.width-60 ,12);
		this.textCanvas.context.fillText("states", this.textCanvas.width-60 ,24);
		this.textCanvas.context.fillText("Updated", this.textCanvas.width-50 ,this.textCanvas.height-20);
		this.textCanvas.context.fillText("state", this.textCanvas.width-50 ,this.textCanvas.height-10);
		this.textCanvas.context.rotate( Math.PI/2 );
		this.textCanvas.context.fillText("Current", this.textCanvas.width-35 ,-10);
		this.textCanvas.context.rotate( -Math.PI/2 );
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

ruleCanvas.clickEventSimple = function( event ){

	// Get mouse position and convert to cell grid number
	var mousePos 	= this.getMousePos( event );
	var x = Math.floor(mousePos.x * this.currentRuleSet.dimensions.x / this.dimensions.x );
	var y = Math.floor(mousePos.y * this.currentRuleSet.dimensions.y / this.dimensions.y  );

	var n = 4*( x + this.currentRuleSet.dimensions.x * y );

	if ( x > 0 && y < this.currentRuleSet.dimensions.y-8 ){
		if ( this.currentRuleSet.data[n] == 0 && this.currentRuleSet.data[n+1] == 0 && this.currentRuleSet.data[n+2] == 0 && this.currentRuleSet.data[n+3] == 0 ){
			this.currentRuleSet.data[n] 	= 255;
			this.currentRuleSet.data[n+1] = 0;
			this.currentRuleSet.data[n+2] = 0;
			this.currentRuleSet.data[n+3] = 255;
		}
		else{	this.currentRuleSet.data[n] = 0;
					this.currentRuleSet.data[n+1] = 0;
					this.currentRuleSet.data[n+2] = 0;
					this.currentRuleSet.data[n+3] = 0;	}

		this.loadRuleTexture();
		this.renderRules();
		this.pushRuleToMain();

		this.currentRuleSet.name = "Custom";
		document.getElementById("loadpreset").value = "custom";

	}
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
var neighbourhoods = { full: new NEIGHBOURHOOD("Full"),
											 vonNeumann: new NEIGHBOURHOOD("Von Neumann"),
											 LColumn: 	new NEIGHBOURHOOD("L.H. Column"),
											 RColumn: 	new NEIGHBOURHOOD("R.H. Column"),
											 BLCorner:	new NEIGHBOURHOOD("B.L. Corner"),
											 TRCorner:	new NEIGHBOURHOOD("T.R. Corner"),
											 OneDLeft:	new NEIGHBOURHOOD("1-D Left"),
											 OneDRight:	new NEIGHBOURHOOD("1-D Right"),
										 };

	// NOTE these arrays must have an even length
	neighbourhoods.full.array 			= [ -1,-1,-1,0,-1,1,0,-1,0,1,1,-1,1,0,1,1 ];
	neighbourhoods.vonNeumann.array = [ -1,0,0,-1,0,1,1,0 ];
	neighbourhoods.LColumn.array 		= [ -1,-1,-1,0,-1,1 ];
	neighbourhoods.RColumn.array 		= [  1,-1, 1,0, 1,1 ];
	neighbourhoods.BLCorner.array 	= [ -1,-1,-1,0,-1,1,0,-1,1,-1];
	neighbourhoods.TRCorner.array 	= [ -1,1,0,1,1,-1,1,0,1,1 ];
	neighbourhoods.OneDLeft.array 	= [ -1,-1,-1,1 ];
	neighbourhoods.OneDRight.array 	= [  1,-1,1,1 ];

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
