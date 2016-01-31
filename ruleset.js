'use strict';

// *** Class and methods for the cellular automota ruleset ***//

function ruleSet(){

	this.name;
	this.number;

	this.if 		= [];
	this.and 		= [];
	this.than		= [];
	this.then 		= [];

}

// Load a preset ruleset

ruleSet.prototype.loadPreset = function( preset ){
	this.number 	= preset.number;
	this.if 		= preset.if;
	this.and 		= preset.and;
	this.than		= preset.than;
	this.then 		= preset.then;

	document.getElementById("numberofrules").value = preset.number;
}

// Append the ruleset from the values from the HTML inputs

ruleSet.prototype.getRulesFromHTML = function(){
	for ( var n = 0; n < this.number; n++ ){
		this.if[n]		= stringToBool( document.getElementById( "if" 	+ n.toString() ).value );
		this.and[n] 	= document.getElementById( "and" 	+ n.toString() ).value;
		this.than[n]	= document.getElementById( "than" + n.toString() ).value = this.than[n];
		this.then[n]	= stringToBool( document.getElementById( "then" + n.toString() ).value );
	}
}

// update HTML values

ruleSet.prototype.setHTML = function(){
	for ( var n = 0; n < this.number; n++ ){
		document.getElementById( "if" 	+ n.toString() ).value = boolToString( this.if[n]   );
		document.getElementById( "and" 	+ n.toString() ).value = this.and[n];
		document.getElementById( "than" + n.toString() ).value = this.than[n];
		document.getElementById( "then" + n.toString() ).value = boolToString( this.then[n] );
	}
}

// Clear HTML inputs

ruleSet.prototype.clearHTML = function(){
	for ( var n = 0; n < this.number; n++ ){
		document.getElementById( "container"+n.toString() ).parentNode.removeChild( document.getElementById( "container"+n.toString() ) );
	}	
}

// Create HTML inputs for ruleset 
// (initially unset so don't need to add all the options every time)

ruleSet.prototype.makeHTML = function(){
	
	for ( var n = this.number -1; n > -1; n-- ){

		// Make HTML rule container
		var container = document.createElement("div")
		container.id = "container"+n.toString();

		container.className = "main padding";

		container.innerHTML	=  container.innerHTML + "Rule: " + (n+1).toString();

		// Insert ruleset container
		insertAfter( container, ruleformtop );

		// Create inout form
		var ruleForm = document.createElement("form");

		ruleForm.onsubmit = function(){ return false;} ;
		
		// Add inputs and label according to number of rules
		ruleForm.innerHTML = 'If cell is <select class="main" id="if' + n.toString() + '"><option value="true">Alive</option> <option value= "false">Dead </option></select>';

		ruleForm.innerHTML = ruleForm.innerHTML + 'and &#8470; of live neighbours is <select class="main" id="and' + n.toString() + '"><option value= "="  > =  </option><option value= ">"  > &gt;  </option><option value= "<"  > &lt;  </option></select>';

		ruleForm.innerHTML = ruleForm.innerHTML + '<input type="number" class="main" id="than' + n.toString() + '" min="0" max="8" value ="0" step="1" >';

		ruleForm.innerHTML = ruleForm.innerHTML + 'then the cell will be<select class="main" id="then' + n.toString() + '"><option value= "true"  > Alive   </option><option value= "false"> Dead  </option></select>'

		// Insert form into Div
		container.appendChild(ruleForm);
	}
}

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset 

var presets = { gameOfLife: new ruleSet, oneD: new ruleSet, dayAndNight: new ruleSet };

	// Conway's game of life ruleset
	presets.gameOfLife.name 	= "Game of Life";
	presets.gameOfLife.number 	= 3;
	presets.gameOfLife.if     	= [true,true,false];
	presets.gameOfLife.and 		= ["<",">","="];
	presets.gameOfLife.than		= [2,3,3];
	presets.gameOfLife.then		= [false,false,true];

	// 2-D ruleset
	presets.oneD.name 			= "2-dimensional";
	presets.oneD.number 		= 3;
	presets.oneD.if 			= [true,true,false];
	presets.oneD.and 			= ["=","=","="];
	presets.oneD.than			= [2,0,1];
	presets.oneD.then			= [false,false,true];

	// Day and Night1
	presets.dayAndNight.name 	= "Day and Night";
	presets.dayAndNight.number 	= 4;
	presets.dayAndNight.if 		= [true,true,false,false];
	presets.dayAndNight.and 	= ["<","=","=",">"];
	presets.dayAndNight.than	= [3,5,3,5];
	presets.dayAndNight.then	= [false,false,true,true];	

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
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