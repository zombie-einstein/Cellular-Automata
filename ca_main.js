'use strict';

//******************************************************//
// MAIN SCRIPT STARTS HERE:                             //
// - Set size of canvas                                 //
// - Set size of cells                                  //
// - Declare variables that require global scope        //
// - Generate and render the initial screen             //
//                                                      // 
//******************************************************//   

// Set canvas size

var canvas 			= document.getElementById("canvas");
var ctx 			= canvas.getContext("2d");
ctx.canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
ctx.canvas.height 	= window.innerHeight;
var canvasWidth 	= canvas.width;
var canvasHeight 	= canvas.height;

// Get number of cells from HTMl and thus calculate height of single cell

var numCellsWidth  	= Math.floor(document.getElementById("numCellsWidthForm").value);
var cellWidth 		= canvasWidth / numCellsWidth;

// Calculate number of cells that most closely produces an integer number of square cells

var numCellsHeight 	= Math.round( canvasHeight / cellWidth ); 
document.getElementById("numCellsHeightForm").value = numCellsHeight;
var cellHeight 		= canvasHeight / numCellsHeight;

// Get updating method from HTML

var updateMethod	= document.getElementById("updating").value;

// Initialize timestep variable outside scope of animation function

var testCell 		= new cell(0,0);	// blank cell to use for method application

var timeStep;	

var simSpeed 		= document.getElementById("speedRange").value;

var paused 			= true;	// Simulation status switch

// Get topology from HTML
		
var topology		= document.getElementById("topology").value;

var vonNeumann		= document.getElementById("vonneumann").value == "true";

// Initialize ruleset variables and convert booleans HTML

var rulesIf, rulesAnd, rulesThan, rulesThen	= [];

// Initialize cells and render

var CELLS = [];

CELLS.createCells( numCellsWidth, numCellsHeight );

//renderAllCells();

// Make menu of and get colourscheme from HTML

var currentColorScheme = eval(document.getElementById("chooseColorScheme").value);
currentColorScheme.createMenus();

// Color variables
var aliveColor;
var deadColor;

// Set alive cell color ( includes rendering cells )
changeAliveColor();

// Write title in cells

makeTitle();

// Create ruleset and intitially load game of life
var currentRuleSet = new ruleSet();

currentRuleSet.loadPreset( presets.gameOfLife );
document.getElementById("loadpreset").value = "gameOfLife";

// Generate HTML rulset inputs and set values
currentRuleSet.makeHTML();
currentRuleSet.setHTML();

// Set background and menu colors
changeBackgroundColor();
changeTextColor();

// Console message on succesful page load
console.log("Loaded Succesfully");