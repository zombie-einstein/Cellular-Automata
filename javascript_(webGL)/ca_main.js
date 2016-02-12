'use strict';

//******************************************************//
// MAIN SCRIPT STARTS HERE:                             //
// - Set size of canvas                                 //
// - Set size of cells                                  //
// - Declare variables that require global scope        //
// - Generate and render the initial screen             //
//                                                      // 
//******************************************************//   

// Canvas declared in web_gl.js
canvas 		= document.getElementById("canvas");

// Dynamically set canvas size
canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
canvas.height 	= window.innerHeight;

var canvasWidth 	= canvas.width;
var canvasHeight 	= canvas.height;

// Set initial number of cells
var numCellsWidth  = 1024;
var numCellsHeight = 1024;
// Set values in HTML
document.getElementById("cellWidthSelect" ).value = numCellsWidth.toString();
document.getElementById("cellHeightSelect").value = numCellsHeight.toString();

var cellWidth 	= canvasWidth  / numCellsWidth;
var cellHeight 	= canvasHeight / numCellsHeight;

// Start webGL & make textures
startGL();
createTextures( numCellsWidth, numCellsHeight );

// Get updating method from HTML
makeUpdateMenu();
//var currentUpdateMethod = eval(document.getElementById("updatemethod").value);
//document.getElementById("updatedescription").innerHTML = currentUpdateMethod.name+": "+currentUpdateMethod.description;

// Initialize timestep variable outside scope of animation function
var timeStep;

// blank cell to use for method application
//var testCell 		= new cell(0,0);	

// Get simulation speed from HTML
var simSpeed 		= document.getElementById("speedRange").value;

// Simulation status switch
var paused 			= true;

// Get topology from HTML
//var topology		= document.getElementById("topology").value;
//var vonNeumann		= document.getElementById("vonneumann").value == "true";

// Get show updating cell variable from HTML
//var showUpdating	= false;

// Initialize ruleset variables and convert booleans HTML

//var rulesIf, rulesAnd, rulesThan, rulesThen	= [];

// Initialize cells and populate array
//var CELLS = [];
//CELLS.createCells( numCellsWidth, numCellsHeight );


// Make a menu of pattern types in HTML
createPatternMenu();

// Make menu of and get colourscheme from HTML
createColorSchemeMenu();
var currentColorScheme = eval(document.getElementById("chooseColorScheme").value);
currentColorScheme.createMenus();

// Declare Color variables
var aliveColor;
var deadColor;

// Set alive cell color ( includes rendering cells )
//changeAliveColor();

// Write title in cells
makeTitle();

// Create chosen ruleset variable and intitially load game of life
var currentRuleSet = new ruleSet();
currentRuleSet.loadPreset( presets.gameOfLife );
document.getElementById("loadpreset").value = "gameOfLife";

// Generate HTML rulset inputs and set values
currentRuleSet.makeHTML();
currentRuleSet.setHTML();

// Set background and menu colors from HTML
changeBackgroundColor();
changeTextColor();
document.getElementById("stopbutton").style.backgroundColor = LightenDarkenColor(deadColor,20);

generateUpdateFunctions();

// Console message on succesful page load
console.log("Loaded Succesfully");