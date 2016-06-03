'use strict';

// ****************************************************** //
// ******** STEPS NECCESARY TO LOAD PAGE AND PROGRAM **** //
// ****************************************************** //


// Object to hold cell parameters, set intital number at 64x64
var cells = { d: new vec(0,0), n: new vec(128,128) };

// Send these initial values to the HTML
document.getElementById("cellWidthSelect" ).value = cells.n.x.toString();
document.getElementById("cellHeightSelect").value = cells.n.y.toString();

// Calculate cell dimensions
cells.d.x = mainCanvas.dimensions.x / cells.n.x;
cells.d.y = mainCanvas.dimensions.y / cells.n.y;

// Create main canvas textures from these values
mainCanvas.textures.back.loadR( mainCanvas.gl, cells.n.x, cells.n.y );
mainCanvas.textures.front.loadR( mainCanvas.gl, cells.n.x, cells.n.y );
mainCanvas.textures.analysis.loadR( mainCanvas.gl, cells.n.x, cells.n.y );
mainCanvas.textures.analysisB.loadR( mainCanvas.gl, cells.n.x, cells.n.y );

// Get simulation speed from HTML
mainCanvas.speed 	= document.getElementById("speedRange").value;

// Make menu of and get colourscheme from HTML
currentColorScheme.createColorSchemeMenu();
currentColorScheme.loadColorScheme( eval(document.getElementById("chooseColorScheme").value) );
currentRuleSet.setOverlayColor(currentColorScheme.menu);

// Load the game of life ruleset to the current ruleset
currentRuleSet.loadPreset( presets.rule101 );
document.getElementById("loadpreset").value = "rule101";

// Console message on succesful page load
console.log("Page loaded succesfully");
