'use strict';

function pattern(x,y){
	this.area = new vec(x,y);
	this.livePoints = [];
	this.map = [];
}

Array.prototype.printPattern = function( location, pattern ){
	if ( pattern.area.x > numCellsWidth || pattern.area.y > numCellsHeight ){
		alert("Pattern too large for area");
		return;
	}
	else{
		for ( var n = 0; n < pattern.map.length; n++ ){
			for ( var m = 0; m < pattern.map[n].length; m++ ){
				if ( pattern.map[n][m] == 'O' ){
					this[location.x+n][location.y+m].current = true;
					this[location.x+n][location.y+m].render();
				}
				else{
					this[location.x+n][location.y+m].current = false;
					this[location.x+n][location.y+m].render();
				}
			}
		}
	}
}

function createLWSS(){
	var LWSS = new pattern(5,4);

	LWSS.map[0]		= 'OXOX';
	LWSS.map[1]		= 'XXXO';
	LWSS.map[2]		= 'XXXO';
	LWSS.map[3]		= 'OXXO';
	LWSS.map[4]		= 'XOOO';

	return LWSS;
}

function createGlider(){
	var glider = new pattern(3,2);

	glider.map[0]	= 'XXO';
	glider.map[1]	= 'OXO';
	glider.map[2]	= 'XOO';

	return glider;
}

function createBlock(){
	var block = new pattern(2,2);

	block.map[0]	= 'OO';
	block.map[1]	= block.map[0];

	return block;
}

function createBeehive(){
	var beehive = new pattern(4,3);

	beehive.map[0]	= 'XOX';
	beehive.map[1]	= 'OXO';
	beehive.map[2]	= 'OXO';
	beehive.map[3]	= 'XOX';

	return beehive;
}

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