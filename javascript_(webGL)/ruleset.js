'use strict';

// *** Class and methods for the cellular automota ruleset ***//

function ruleSet( x, y ){

	this.name;				// Ruleset name
	this.dimensions = new vec( x, y );

	this.data = new Uint8Array( 4*x*y );

}

// Load a preset ruleset
ruleSet.prototype.loadPreset = function( preset ){
	// Copy values, making sure not to pass by reference!!
	this.dimensions.assign( preset.dimensions );

	this.data	= new Uint8Array(  4*preset.dimensions.x*preset.dimensions.y );

	for ( var i = 0; i < 4*preset.dimensions.x*preset.dimensions.y; i++ ){ this.data[i] = preset.data[i]; }

}

function updateRuleset(event){

	var mousePos 	= getMousePos( document.getElementById("aliverulecanvas"), event );
	var x = Math.floor( (mousePos.x-10)/20  );
	var y = Math.floor( mousePos.y/20 );
	//console.log(x,",",y);

	if ( y == 0 && x >= 0 ){
		if ( currentRuleSet.deadSet[x][0] == 1 ){
			currentRuleSet.deadSet[x][0] = 0;
			currentRuleSet.deadSet[x][3] = 0;
		}
		else{
			currentRuleSet.deadSet[x][0] = 1;
			currentRuleSet.deadSet[x][3] = 1;
		}
	}
	if ( y == 1 && x >= 0 ){
		if ( currentRuleSet.aliveSet[x][0] == 1 ){
			currentRuleSet.aliveSet[x][0] = 0;
			currentRuleSet.aliveSet[x][3] = 0;
		}
		else{
			currentRuleSet.aliveSet[x][0] = 1;
			currentRuleSet.aliveSet[x][3] = 1;
		}
	}
	rulesetCanvas();
	document.getElementById("loadpreset").value = "custom";
}


// Append the ruleset from the values from the HTML inputs

function drawRuleset( ruleset, context ){

}

// Create canvas inputs for ruleset
function rulesetCanvas(){

	var ruleCanvas 	= document.getElementById("aliverulecanvas");
	var ruleContext	= ruleCanvas.getContext("2d");

	ruleContext.clearRect(0,0,ruleCanvas.width,ruleCanvas.height);

	ruleContext.fillStyle = document.getElementById("choosealivecolor").value;
	ruleContext.fillRect( 0, 20, 10, 20 )

	drawRuleset( currentRuleSet, ruleContext );

	ruleContext.strokeStyle = document.getElementById("choosemenucolor").value;
	ruleContext.strokeRect( 0,0, 30,20);
	ruleContext.strokeRect( 0,20, 30,20);

	ruleContext.font = "19px sans-serif";
	ruleContext.fillStyle = document.getElementById("choosemenucolor").value;

	for ( var i = 0; i < 9; i++){
		ruleContext.fillText( i.toString(), 15 + i*20, 17 );
	}

	for ( var i = 0; i < 3; i++){
		for( var j = 0; j < 9; j++ ){

			ruleContext.strokeRect( 10 + j*20, i*20, 20, 20 );

		}
	}

}



// Insert HTML element after another
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
// Convert boolean value to appropriate string
function boolToString( a ){
	if( a == true ){ return "true";}
	else{ return "false"; }
}
// Convet string to appropriate boolean
function stringToBool( a ){
	return a == "true";
}
