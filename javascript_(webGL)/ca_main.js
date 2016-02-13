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
var numCellsWidth  = 64;
var numCellsHeight = 64;
// Set values in HTML
document.getElementById("cellWidthSelect" ).value = numCellsWidth.toString();
document.getElementById("cellHeightSelect").value = numCellsHeight.toString();

// Calculate cell width (to get value of mouse position)
var cellWidth 	= canvasWidth  / numCellsWidth;
var cellHeight 	= canvasHeight / numCellsHeight;

// Start webGL & make textures
startGL();
createTextures( numCellsWidth, numCellsHeight );

// Initialize timestep variable outside scope of animation function
var timeStep;	

// Get simulation speed from HTML
var simSpeed 		= document.getElementById("speedRange").value;

// Simulation status switch
var paused 			= true;

// Create chosen ruleset variable and intitially load "Game of Life"
var currentRuleSet = new ruleSet();
currentRuleSet.loadPreset( presets.gameOfLife );
document.getElementById("loadpreset").value = "gameOfLife";

// Make a menu of pattern types in HTML
createPatternMenu();

// Make menu of and get colourscheme from HTML
createColorSchemeMenu();
var currentColorScheme = eval(document.getElementById("chooseColorScheme").value);
currentColorScheme.createMenus();

// Declare Color variables
var aliveColor;
var deadColor;

// Send live color to renderer
changeAliveColor();

// Write title in cells
makeTitle();

// Set background and menu colors from HTML
changeBackgroundColor();
changeTextColor();
document.getElementById("stopbutton").style.backgroundColor = LightenDarkenColor(deadColor,20);

//rulesetCanvas();

// Console message on succesful page load
console.log("Loaded Succesfully");