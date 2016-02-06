'use strict';

// Color scheme variables and also creates the HTML menus
// Color schemes can easily be added by adding their name to the color set


// Color set class (gathers colors together)
function colorSet(){

		this.name;	// Name of color set

		this.dead;	// Colors for dead cells & background
		this.alive;	// Colors for alive cells
		this.menu;	// Colors for menu items
}

// Actual color
function color( name, value ){

		this.name 	= name;	// Name of  color 
		this.value 	= value; // Colors hex value

}

// Object containing color sets 
var colorSchemes = { solarize: new colorSet, strong: new colorSet };

	// Strong (i.e. bright) colors:
	var black  = new color( "Black" , "#000000" );
	var white  = new color( "White" , "#ffffff" );
	var blue   = new color( "Blue"  , "#0000ff" );
	var green  = new color( "Green" , "#006400" );
	var red	   = new color( "Red"   , "#ff0000" );
	var orange = new color( "Orange", "#FFA500" );

	// Strong color set
	colorSchemes.strong.name 	= "Primary";
	
	colorSchemes.strong.dead	= [ blue, green, black , white ];
	colorSchemes.strong.alive	= [ red, orange, white, black ];
	colorSchemes.strong.menu 	= [ white, black, red, orange ];


	// Solarize colors
	var base03	= new color( "Dark Blue" , "#002b36" );
	var base02	= new color( "Dark Green", "#073642" );
	var base2	= new color( "Light Grey", "#eee8d5" );
	var base3	= new color( "White"     , "#fdf6e3" );
	var base01	= new color( "Grey 1" 	 , "#586e75" );
	var base00	= new color( "Grey 2"	 , "#657b83" );
	var base0 	= new color( "Grey 3"	 , "#839496" );
	var base1	= new color( "Grey 4"	 , "#93a1a1" );
	var sYellow = new color( "Yellow"	 , "#b58900" );
	var sOrange = new color( "Orange"	 , "#cb4b16" );
	var sMagenta= new color( "Magenta"	 , "#d33682" );
	var sBlue	= new color( "Blue" 	 , "#268bd2" );
	var sGreen	= new color( "Green" 	 , "#859900" );

	// Solarize color set
	colorSchemes.solarize.name = "Solarize";

	colorSchemes.solarize.dead 	= [ base03, base02, base2, base3 ];
	colorSchemes.solarize.alive = [ sMagenta, sYellow, sOrange, sBlue, sGreen];
	colorSchemes.solarize.menu  = [ base01, base00, base0, base1 ];

// Create dropdown menu of color schemes
function createColorSchemeMenu(){
for ( var x in colorSchemes ){
	document.getElementById("chooseColorScheme").innerHTML += '<option value="colorSchemes.'+x.toString()+'"> '+colorSchemes[x].name+' </option>';
}}

// Create dropdown color menus for a colorset
colorSet.prototype.createMenus = function(){
	for ( var n = 0; n < this.dead.length; n++ ){
	document.getElementById("choosedeadcolor").innerHTML+= '<option value='+this.dead[n].value+'> '+this.dead[n].name+' </option>';
	}
	for ( var n = 0; n < this.alive.length; n++ ){
	document.getElementById("choosealivecolor").innerHTML+= '<option value='+this.alive[n].value+'> '+this.alive[n].name+' </option>';
	}
	for ( var n = 0; n < this.menu.length; n++ ){
	document.getElementById("choosemenucolor").innerHTML+= '<option value='+this.menu[n].value+'> '+this.menu[n].name+' </option>';
	}
}

// Clear color menus
colorSet.prototype.clearMenus = function(){

	document.getElementById("choosedeadcolor").innerHTML = " ";
	document.getElementById("choosealivecolor").innerHTML= " ";
	document.getElementById("choosemenucolor").innerHTML = " ";

}

// ******* This taken from "css-tricks.com/snippets/javascript/lighten-darken-color/""

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}