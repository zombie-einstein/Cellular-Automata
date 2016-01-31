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
	for ( var n = 0; n < this.number; n++ ){
		this.if[n]		= preset.if[n];
		this.and[n] 	= preset.and[n];
		this.than[n]	= preset.than[n];
		this.then[n]	= preset.then[n];
	}
	//this.if 		= preset.if;
	//this.and 		= preset.and;
	//this.than		= preset.than;
	//this.then 		= preset.then;

	document.getElementById("numberofrules").value = preset.number;
}

// Append the ruleset from the values from the HTML inputs

ruleSet.prototype.getRulesFromHTML = function(){
	for ( var n = 0; n < this.number; n++ ){
		this.if[n]		= stringToBool( document.getElementById( "if" 	+ n.toString() ).value );
		this.and[n] 	= document.getElementById( "and"  + n.toString() ).value;
		this.than[n]	= document.getElementById( "than" + n.toString() ).value;
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