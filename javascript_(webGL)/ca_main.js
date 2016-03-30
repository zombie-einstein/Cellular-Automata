'use strict';

// ****************************************************** //
// ******** STEPS NECCESARY TO LOAD PAGE AND PROGRAM **** //
// ****************************************************** //


// Object to hold cell parameters, set intital number at 64x64
var cells = { d: new vec(0,0), n: new vec(64,64) };

// Send these initial values to the HTML
document.getElementById("cellWidthSelect" ).value = cells.n.x.toString();
document.getElementById("cellHeightSelect").value = cells.n.y.toString();

// Calculate cell dimensions
cells.d.x = mainCanvas.dimensions.x / cells.n.x;
cells.d.y = mainCanvas.dimensions.y / cells.n.y;

// Create main canvas textures from these values
mainCanvas.textures.back.loadR( mainCanvas.gl, cells.n.x, cells.n.y );
mainCanvas.textures.front.loadR( mainCanvas.gl, cells.n.x, cells.n.y );

// Get simulation speed from HTML
mainCanvas.speed 	= document.getElementById("speedRange").value;

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
mainCanvas.makeTitle();

// Set background and menu colors from HTML
changeBackgroundColor();
changeTextColor();
document.getElementById("stopbutton").style.backgroundColor = LightenDarkenColor(deadColor,40);

// Load the game of life ruleset to the current ruleset
ruleCanvas.loadPreset( presets.gameOfLife );
ruleCanvas.renderText();
document.getElementById("loadpreset").value = "gameOfLife";

// Load the full neighbourhood property
currentNeighbourhood.load(neighbourhoods.full);

// Console message on succesful page load
console.log("Page loaded succesfully");
