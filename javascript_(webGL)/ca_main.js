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
canvas 			= document.getElementById("canvas");

// Dynamically set canvas size accounting for menu bar
canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
canvas.height 	= window.innerHeight;

// Object to hold cell parameters, set intital number at 64x64
var cells = { d: new vec(0,0), n: new vec(64,64) };

// Send these initial values to the HTML
document.getElementById("cellWidthSelect" ).value = cells.n.x.toString();
document.getElementById("cellHeightSelect").value = cells.n.y.toString();

cells.d.x = canvas.width  / cells.n.x;
cells.d.y = canvas.height / cells.n.y;

// Create a current ruleset variable and intitially load "Game of Life"
var currentRuleSet = new ruleSet(0,0);
currentRuleSet.loadPreset( presets.gameOfLife );
document.getElementById("loadpreset").value = "gameOfLife";

// Start webGL & make textures of appropriate dimensions
startGL();
createTextures( cells.n.x, cells.n.y );

// Initialize timestep variable outside scope of animation function
canvas.timeStep;

// Get simulation speed from HTML
canvas.speed 	= document.getElementById("speedRange").value;

// Simulation status switch
canvas.paused 		= true;

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
document.getElementById("stopbutton").style.backgroundColor = LightenDarkenColor(deadColor,40);

// Console message on succesful page load
console.log("Loaded Succesfully");
