'use strict';

//******** Pattern class, printer and templates ********//
// ** Also creates pattern menus in HTML dynamically at run time **//

// Blank pattern constructor

function pattern(x,y){

	this.name;
	this.area = new vec(x,y);	// Size of pattern
	this.map = [];				// Array of lines for pattern

}

// Collects pattern types together (i.e. static )
function patternType(){

	this.name;
	this.patterns = [];

}

//  Pattern printer onto cells

pattern.prototype.printPattern = function( location ){
	// If the pattern is too large for area cancel and send alert message
	if ( this.area.x > cells.n.x || this.area.y > cells.n.y ){
		alert("Pattern too large for cell area");
		return;
	}

	else{
		for ( var n = 0; n < this.map.length; n++ ){
			for ( var m = 0; m < this.map[n].length; m++ ){
				// Stay inside the cell array
				if ( location.x+n >= 0 && location.x+n < cells.n.x &&
					 location.y-m >= 0 && location.y-m < cells.n.y ){

					switch( this.map[n][m] ){

						case 'O':

						mainCanvas.setPixelValue( location.x+n, location.y-m, document.getElementById("RCanvas").value, document.getElementById("GCanvas").value,document.getElementById("BCanvas").value, document.getElementById("ACanvas").value );
						//changePixelState( location.x+n, location.y-m, 1 );

					break;

						case 'X':

						mainCanvas.setPixelValue( location.x+n, location.y-m, 0,0,0,0 );
						//changePixelState( location.x+n, location.y-m, 0 );

					break;

				}}
			}
		}
		// Re-render cells after creating pattern
		mainCanvas.renderCells();
	}
}

// Pattern Collection
//var patternArray = { static: new patternType, spaceships: new patternType, guns: new patternType }

// Create dropdown menu of patterns in HTML
function createPatternMenu(){
	// Create entry for single cell switch
	document.getElementById("presetlist").innerHTML+= '<option value="single"> Toggle Single Cell On/Off </option>';
	// entries for random blocks
	document.getElementById("presetlist").innerHTML+= '<option disabled > Or Insert: </option>';
	document.getElementById("presetlist").innerHTML+= '<option disabled > ── Random Blocks ─── </option>';
	document.getElementById("presetlist").innerHTML+= '<option value="random5" > Random 5x5 </option>';
	document.getElementById("presetlist").innerHTML+= '<option value="random10"> Random 10x10 </option>';
	document.getElementById("presetlist").innerHTML+= '<option value="random50"> Random 50x50 </option>';
	// Add each pattern type to the list
	//for ( x in patternArray ){
	//	document.getElementById("presetlist").innerHTML+= '<option disabled > ── '+patternArray[x].name+' ─── </option>';
		// Create menu entry for each pattern, and set value to point to pattern
	//	for ( var n = 0; n < patternArray[x].patterns.length; n++ ){

	//		document.getElementById("presetlist").innerHTML+= '<option value="patternArray.'+x.toString()+'.patterns['+n.toString()+']"> '+patternArray[x].patterns[n].name+' </option>';

	//	}
	//}
}

// Create a random block of a given size
function createRandomBlock( x, y ){
	var randomBlock = new pattern(x,y);

	for ( var n = 0; n < x; n++ ){
			randomBlock.map[n] = [];
			for ( var m = 0; m < y; m++){
				if  ( Math.random() >= 0.5 ){ randomBlock.map[n][m] = 'X'; }
				else{ randomBlock.map[n][m] = 'O'; }
			}
	}
	return randomBlock;
}

// "Game Of Life Title"
function createTitle(){
	var title = new pattern(20,20);
	// - G - O - L -

	title.map[0]	= 'XOOOOX'+'X'+'XOOOOX'+'X'+'OOOOOO';
	title.map[1]	= 'OXXXXO'+'X'+'OXXXXO'+'X'+'XXXXXO';
	title.map[2]	= 'OXXOXO'+'X'+'OXXXXO'+'X'+'XXXXXO';
	title.map[3]	= 'XOXOOX'+'X'+'XOOOOX'+'X'+'XXXXXO';
	title.map[4]	= 'XXXXXX'+'X'+'XXXXXX'+'X'+'XXXXXX';

	// - A - F - I -

	title.map[5]	= 'XOOOOO'+'X'+'OOOOOO'+'X'+'OXXXXO';
	title.map[6]	= 'OXOXXX'+'X'+'OXOXXX'+'X'+'OOOOOO';
	title.map[7]	= 'OXOXXX'+'X'+'OXOXXX'+'X'+'OXXXXO';
	title.map[8]	= 'XOOOOO'+'X'+'OXXXXX'+'X'+'OXXXXO';
	title.map[9]	= 'XXXXXX'+'X'+'XXXXXX'+'X'+'XXXXXX';

	// - M -  - F -

	title.map[10]	= 'OOOOOO'+'X'+'XXXXXX'+'X'+'OOOOOO';
	title.map[11]	= 'XOXXXX'+'X'+'XXXXXX'+'X'+'OXOXXX';
	title.map[12]	= 'XXOXXX'+'X'+'XXXXXX'+'X'+'OXOXXX';
	title.map[13]	= 'XOXXXX'+'X'+'XXXXXX'+'X'+'OXXXXX';
	title.map[14]	= 'OOOOOO'+'X'+'XXXXXX'+'X'+'XXXXXX';

	// - E -  - E -

	title.map[15]	= 'XXXXXX'+'X'+'XXXXXX'+'X'+'OOOOOO';
	title.map[16]	= 'OOOOOO'+'X'+'XXXXXX'+'X'+'OXOXXO';
	title.map[17]	= 'OXOXXO'+'X'+'XXXXXX'+'X'+'OXOXXO';
	title.map[18]	= 'OXOXXO'+'X'+'XXXXXX'+'X'+'OXXXXO';
	title.map[19]	= 'OXXXXO'+'X'+'XXXXXX'+'X'+'XXXXXX';

	return title;
}
