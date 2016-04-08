'use strict';

// Color scheme variables and also creates the HTML menus
// Color schemes can easily be added by adding their name to the color set


// Color set class (gathers colors together)
function colorSet( n ){

		this.name = n;	// Name of color set

		this.dead 		= undefined;	// Colors for dead cells & background
		this.alive		= undefined;	// Colors for alive cells
		this.highlight= undefined;
		this.menu			= undefined;	// Colors for menu items
}

// Declare global colorscheme object
var currentColorScheme = new colorSet("Current");

// Object containing color sets
currentColorScheme.colorSchemes = { plain: new colorSet("Plain"),
										 								bAndW: new colorSet("Black and White"),
										 								solarize: new colorSet("Solarize"),
										 								tech: new colorSet("Technical") };

	// Plain colorscheme
	currentColorScheme.colorSchemes.plain.dead  		= "#fdf6e3";
	currentColorScheme.colorSchemes.plain.alive  		= "#ff0000";
	currentColorScheme.colorSchemes.plain.highlight	= "#ffffff";
	currentColorScheme.colorSchemes.plain.menu			= "#586e75";

	// Black and White
	currentColorScheme.colorSchemes.bAndW.dead			= "#ffffff";
	currentColorScheme.colorSchemes.bAndW.alive			= "#000000";
	currentColorScheme.colorSchemes.bAndW.highlight	= "#e6e6e6";
	currentColorScheme.colorSchemes.bAndW.menu			= "#000000";

	// Solarize
	currentColorScheme.colorSchemes.solarize.dead		= "#002b36";
	currentColorScheme.colorSchemes.solarize.alive	= "#b58900";
	currentColorScheme.colorSchemes.solarize.highlight = "#073642";
	currentColorScheme.colorSchemes.solarize.menu		= "#93a1a1";

	// Technical Color Scheme
	currentColorScheme.colorSchemes.tech.dead				= "#000000";
	currentColorScheme.colorSchemes.tech.alive			= "#1ec503";
	currentColorScheme.colorSchemes.tech.highlight	= "#073201";
	currentColorScheme.colorSchemes.tech.menu				= "#e9ffe6";


// Create dropdown menu of color schemes
currentColorScheme.createColorSchemeMenu = function(){

	for ( var x in this.colorSchemes ){
		document.getElementById("chooseColorScheme").innerHTML += '<option value="currentColorScheme.colorSchemes.'+x.toString()+'"> '+this.colorSchemes[x].name+' </option>';
	}
}

// Convert a hex value to RGB values
function convertToRGB( color ){

		var hex = color.replace('#','');
		var tempRGB = [];
		tempRGB[0] = parseInt(hex.substring(0,2), 16);
		tempRGB[1] = parseInt(hex.substring(2,4), 16);
		tempRGB[2] = parseInt(hex.substring(4,6), 16);

		return tempRGB;
}

// Load a color scheme to current
currentColorScheme.loadColorScheme = function( scheme ){

	// Copy values
	this.dead 	= scheme.dead;
	this.alive	= scheme.alive;
	this.highlight = scheme.highlight;
	this.menu		=	scheme.menu;

	// Convert the desired live color to a RGB colorshift
	this.alive	= convertToRGB( this.alive ).map(function(x){return x/255;});
	this.alive[0] -= 1;

	// Update colors of HTML elements
	document.getElementById("body").style.backgroundColor = this.dead;
	document.getElementById("logo").style.fill = this.menu;

	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.backgroundColor = this.dead;
	}

	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = this.menu;
		elementsToChange[i].style.borderColor = this.menu;
	}
	var elementsToChange = document.getElementsByClassName("bordersTop");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = this.menu;
		elementsToChange[i].style.borderColor = this.menu;
	}

}
