'use strict';

//******** Pattern class, printer and templates ********//

// Blank pattern constructor

function pattern(x,y){
	this.area = new vec(x,y);	// Size of pattern
	this.livePoints = [];		// Points to mark for update (not used yet)
	this.map = [];				// Array of lines for pattern
}

//  Pattern printer onto cells

Array.prototype.printPattern = function( location, pattern ){
	if ( pattern.area.x > numCellsWidth || pattern.area.y > numCellsHeight ){
		alert("Pattern too large for area");
		return;
	}
	else{
		for ( var n = 0; n < pattern.map.length; n++ ){
			for ( var m = 0; m < pattern.map[n].length; m++ ){

				if ( location.x+n >= 0 && location.x+n < numCellsWidth &&  
					 location.y+m >= 0 && location.y+m < numCellsHeight ){

				switch( pattern.map[n][m] ){

					case 'O':

					this[location.x+n][location.y+m].makeAlive();
					//this[location.x+n][location.y+m].render();

					break;

					case 'X':

					this[location.x+n][location.y+m].kill();
					//this[location.x+n][location.y+m].render();

					break;
				
				}}
			}
		}
		renderAllCells();
	}
}

// Pattern templates
// Mainly taken from strutures defined for Conways games of life

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

// Gosper glider gun
function createGospelGun(){
	var gospelGun = new pattern(36,9);

	gospelGun.map[0]		= 'XXXXOOXXX';
	gospelGun.map[1]		= 'XXXXOOXXX';
	gospelGun.map[2]		= 'XXXXXXXXX';
	gospelGun.map[3]		= 'XXXXXXXXX';
	gospelGun.map[4]		= 'XXXXXXXXX';
	gospelGun.map[5]		= 'XXXXXXXXX';
	gospelGun.map[6]		= 'XXXXXXXXX';
	gospelGun.map[7]		= 'XXXXXXXXX';
	gospelGun.map[8]		= 'XXXXXXXXX';
	gospelGun.map[9]		= 'XXXXXXXXX';
	gospelGun.map[10]		= 'XXXXOOOXX';
	gospelGun.map[11]		= 'XXXOXXXOX';
	gospelGun.map[12]		= 'XXOXXXXXO';
	gospelGun.map[13]		= 'XXOXXXXXO';
	gospelGun.map[14]		= 'XXXXXOXXX';
	gospelGun.map[15]		= 'XXXOXXXOX';
	gospelGun.map[16]		= 'XXXXOOOXX';
	gospelGun.map[17]		= 'XXXXXOXXX';
	gospelGun.map[18]		= 'XXXXXXXXX';
	gospelGun.map[19]		= 'XXXXXXXXX';
	gospelGun.map[20]		= 'XXOOOXXXX';
	gospelGun.map[21]		= 'XXOOOXXXX';
	gospelGun.map[22]		= 'XOXXXOXXX';
	gospelGun.map[23]		= 'XXXXXXXXX';
	gospelGun.map[24]		= 'OOXXXOOXX';
	gospelGun.map[25]		= 'XXXXXXXXX';
	gospelGun.map[26]		= 'XXXXXXXXX';
	gospelGun.map[27]		= 'XXXXXXXXX';
	gospelGun.map[28]		= 'XXXXXXXXX';
	gospelGun.map[29]		= 'XXXXXXXXX';
	gospelGun.map[30]		= 'XXXXXXXXX';
	gospelGun.map[31]		= 'XXXXXXXXX';
	gospelGun.map[32]		= 'XXXXXXXXX';
	gospelGun.map[33]		= 'XXXXXXXXX';
	gospelGun.map[34]		= 'XXOOXXXXX';
	gospelGun.map[35]		= 'XXOOXXXXX';

	return gospelGun;
}

// Lightweight spaceship
function createLWSS(){
	var LWSS = new pattern(5,4);

	LWSS.map[0]		= 'OXOX';
	LWSS.map[1]		= 'XXXO';
	LWSS.map[2]		= 'XXXO';
	LWSS.map[3]		= 'OXXO';
	LWSS.map[4]		= 'XOOO';

	return LWSS;
}

// Glider
function createGlider(){
	var glider = new pattern(3,3);

	glider.map[0]	= 'XXO';
	glider.map[1]	= 'OXO';
	glider.map[2]	= 'XOO';

	return glider;
}

// Stationary Block
function createBlock(){
	var block = new pattern(2,2);

	block.map[0]	= 'OO';
	block.map[1]	= block.map[0];

	return block;
}

// Stationary beehive
function createBeehive(){
	var beehive = new pattern(4,3);

	beehive.map[0]	= 'XOX';
	beehive.map[1]	= 'OXO';
	beehive.map[2]	= 'OXO';
	beehive.map[3]	= 'XOX';

	return beehive;
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