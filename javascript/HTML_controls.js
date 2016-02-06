'use strict';

// **** Functions used by HTML controls **** // 

// Get sim speed from HTML

function getSimSpeed(){
	simSpeed = document.getElementById("speedRange").value;
	// If the simulation is running pause and restart to
	// avoid problem of continually increasing speed
	if ( paused == false ){ 
		pauseSim(); 
		startSim();
	}
}

// Update number and size of cells when changed

function updateGrid(){
	
	pauseSim();	// first send pause signal

	// Get new values from HTML
	numCellsWidth 	= Math.floor(document.getElementById("numCellsWidthForm").value);
	numCellsHeight 	= Math.floor(document.getElementById("numCellsHeightForm").value);

	// Calculate new width of cell
	cellWidth 		= canvasWidth / numCellsWidth; 
	cellHeight 		= canvasHeight / numCellsHeight;

	// Update all cells and render
	CELLS = [];
	CELLS.createCells( numCellsWidth, numCellsHeight );
	renderAllCells();

	console.log("Updated grid succesfully");
}


// Change the topology of the cell space

function changeTopology(){
	
	topology = document.getElementById("topology").value;
	
	pauseSim();	// First pause simulation	
	
	// Generate new neighbours for all cells based on new topology
	CELLS.forAll( testCell.generateNeighbours );

	console.log("Succesfully updated topology to "+topology);
}

// Change Von Neumann property

function changeVonNeumann(){

	pauseSim();	// First pause the simulation

	vonNeumann = document.getElementById("vonneumann").value == "true";
	// Can't be von neumann and 1-D
	if ( currentUpdateMethod.name == "One-Dimensional" ){ 
		vonNeumann = false; 
		document.getElementById("vonneumann").value = "false";
		return; 
	}
	// Generate new neighbour list for all 
	// cells based on Von Neumann neighbourhood
	CELLS.forAll( testCell.generateNeighbours );

	console.log("Neighbourhood Changed");
}

// load a preset and update the HTML forms

function loadAndUpdatePreset(){

	// Clear current ruleset HTML forms
	currentRuleSet.clearHTML();

	// Check if value of form matches element of preset
	// and if so load it to the current ruleset
	for( var x in presets ){
		if ( x ==  document.getElementById("loadpreset").value ){
			currentRuleSet.loadPreset( presets[x] );
		}
	}

	// Make update ruleset HTML forms & set values
	currentRuleSet.makeHTML();
	currentRuleSet.setHTML();

	console.log("Preset ruleset loaded");
}

// make a randomRuleSet

function randomRuleSet(){

	// Clear current ruleset HTML forms
	currentRuleSet.clearHTML();

	currentRuleSet.makeRandom();

	// Make update ruleset HTML forms & set values
	currentRuleSet.makeHTML();
	currentRuleSet.setHTML();
	
	document.getElementById("loadpreset").value = "custom";

	console.log("Random ruleset loaded");
}

// Change the number of rule definitions

function updateNumRules(){
	
	// Clear current ruleset HTML forms
	currentRuleSet.clearHTML();

	var change = currentRuleSet.number - document.getElementById("numberofrules").value;

	currentRuleSet.number = document.getElementById("numberofrules").value;

	if ( change < 0 ){
		for( var n = 0; n > change; n-- ){
			currentRuleSet.if.push(true);
			currentRuleSet.and.push("=");
			currentRuleSet.than.push(0);
			currentRuleSet.then.push(true);
		}
	console.log("Rule Sets increased")
	}
	else{
		for( var n = 0; n < change; n++ ){
			currentRuleSet.if.pop();
			currentRuleSet.and.pop();
			currentRuleSet.than.pop();
			currentRuleSet.then.pop();
		}
	console.log("Rule Sets decreased")	
	}
	
	// Make update ruleset HTML forms & set values
	currentRuleSet.makeHTML();
	currentRuleSet.setHTML();
}

// Update the ruleset from HTML inputs

function updateRuleset(){

	currentRuleSet.getRulesFromHTML();

	document.getElementById("loadpreset").value = "custom";
	console.log("Rules updated");
}

// Change the method by which the cells will update

function changeUpdateMethod(){
	
	// Get update method from HTML and update description paragraph
	currentUpdateMethod = eval(document.getElementById("updatemethod").value);
	document.getElementById("updatedescription").innerHTML = currentUpdateMethod.name+": "+currentUpdateMethod.description;

	// Regenerate neighbours in case they are dependent on update method
	CELLS.forAll( testCell.generateNeighbours );
	// Kill all update signals before they are updated by method
	CELLS.forAll( testCell.killSignal );
	// Perform any intialization actions required by method 
	currentUpdateMethod.initialize();
	// Rerender cells (required if showing updating cells)
	renderAllCells();

}

// Change wether cell that are updating are shown

function changeShowUpdating(){

	if ( currentUpdateMethod.name == "Simultaneous" ){
		document.getElementById("showupdatingcells").value = "false";		
	}
	else{
		var temp = document.getElementById("showupdatingcells").value;
		if ( temp == "false" ){ temp = false };
		showUpdating = temp;
		renderAllCells();
	}
}

// Change color schemes from menu
function changeColorScheme(){

	currentColorScheme = eval(document.getElementById("chooseColorScheme").value);
	currentColorScheme.clearMenus();
	currentColorScheme.createMenus();
	changeBackgroundColor();
	changeAliveColor();
	changeTextColor();

}

// Change background & dead cell color from HTML element and re-render

function changeBackgroundColor(){
	
	deadColor	= document.getElementById("choosedeadcolor").value;
	
	document.getElementById("body").style.backgroundColor = deadColor;

	renderAllCells();
	
	// Update color of HTML elements
	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.backgroundColor = deadColor;
	
	}
}

// Change the color of alive cells and re-render

function changeAliveColor(){
	aliveColor	= document.getElementById("choosealivecolor").value;
	renderAllCells();
}

// Change menu and logo colors using HTML element

function changeTextColor(){
	var textColor	= document.getElementById("choosemenucolor").value;
	
	document.getElementById("logo").style.fill = textColor;

	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = textColor;
		elementsToChange[i].style.borderColor = textColor;
	}
	var elementsToChange = document.getElementsByClassName("bordersTop");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = textColor;
		elementsToChange[i].style.borderColor = textColor;
	}
}